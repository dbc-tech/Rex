import {
  HttpService,
  HttpServiceOptions,
  getWinstonLogger,
} from '@dbc-tech/http-kit'
import got from 'got-cjs'
import { Logger } from 'winston'
import { DefaultCountLimit, DefaultMaskProperties } from './constants'
import { RexListing, RexAccountUser } from './dtos'
import { RexFeedback } from './dtos/rex-feedback.dto'
import { RexConfig } from './interfaces/rex-config'
import {
  RexGotHttpRequest,
  RexRequestBody,
  RexSearchCriteria,
} from './interfaces/rex-http.interface'

export class RexClient {
  http: HttpService
  logger: Logger
  countLimit: number

  constructor(private readonly config: RexConfig) {
    const winstonLogger =
      config.logger ?? getWinstonLogger(config.defaultLoggerOptions)
    this.countLimit = config.countLimit ?? DefaultCountLimit
    const httpConfig: HttpServiceOptions = {
      logging: {
        logger: winstonLogger,
        maskProperties: DefaultMaskProperties,
      },
      http: {
        headers: this.config.customHeaders,
        prefixUrl: config.baseUrl,
        method: 'POST',
        json: {
          limit: this.countLimit,
        },
      },
    }
    this.http = new HttpService(
      this.config.baseUrl,
      this.getAccessToken,
      httpConfig,
    )

    this.logger = winstonLogger.child({ context: 'rex-client' })
    this.logger.debug(`Using Rex baseUrl: ${config.baseUrl}`)
  }

  async GetAccountUsers(criteria?: RexSearchCriteria) {
    return this.paginateSearch<RexAccountUser>('account-users', criteria)
  }

  async GetFeedbacks(criteria?: RexSearchCriteria) {
    return this.paginateSearch<RexFeedback>('feedback', criteria)
  }

  async GetListings(criteria?: RexSearchCriteria) {
    return this.paginateSearch<RexListing>('listings', criteria)
  }

  async getCustomFieldDefinition(): Promise<
    Record<string, boolean | string | any>
  > {
    const existingFieldsBody = {
      module_name: 'listings',
      include_hidden: false,
    }

    const response = await this.http.postJson(
      this.http.urlFromPath('admin-custom-fields/get-definition'),
      existingFieldsBody,
    )

    return response.data
  }

  async paginateSearch<TResult>(
    url: string,
    params?: RexSearchCriteria,
  ): Promise<AsyncIterableIterator<TResult>> {
    let count = 1

    const requestJson = this.createSearchBody(this.countLimit, params)
    this.logger.debug(
      `Paginate request for Rex ${url} API with params: ${JSON.stringify(
        requestJson,
      )}`,
    )
    const response: any = this.http.http.paginate<TResult>(`${url}/search`, {
      json: requestJson,
      pagination: {
        transform: (response): Array<TResult> => {
          const rex = response as any
          return rex.body.result.rows
        },
        paginate: ({ currentItems }) => {
          if (currentItems.length < this.countLimit) {
            return false
          } else {
            count += currentItems.length
            return this.getNextPaginateRequest(
              url,
              currentItems,
              count,
              requestJson,
            )
          }
        },
        backoff: 1000,
      },
    })

    return response
  }

  getNextPaginateRequest<T>(
    url: string,
    currentItems: Array<T>,
    count: number,
    requestParams?: RexRequestBody,
  ): false | RexGotHttpRequest {
    if (currentItems.length < this.countLimit) {
      return false
    } else {
      const json = this.createSearchBody(this.countLimit, requestParams, count)
      this.logger.debug(
        `Rex ${url} API paging to next offset: ${JSON.stringify(json)}`,
      )
      return {
        json,
      }
    }
  }

  getAccessToken = async (): Promise<string> => {
    const url = new URL('Authentication/login', this.config.baseUrl)
    const { email, password, accountId } = this.config

    const response: any = await got
      .post(url, {
        headers: this.config.customHeaders ?? {},
        json: {
          email,
          password,
          account_id: accountId,
        },
      })
      .json()

    return response.result
  }

  private createSearchBody(
    countLimit: number,
    params?: Record<string, any>,
    offset = 0,
  ): RexRequestBody {
    if (params) {
      return {
        ...params,
        limit: countLimit,
        offset,
      }
    }

    return {
      limit: countLimit,
      offset,
    }
  }
}
