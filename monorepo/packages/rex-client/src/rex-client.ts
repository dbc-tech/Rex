import {
  DtoConstructor,
  HttpService,
  getWinstonLogger,
  plainToDto,
} from '@dbc-tech/http-kit'
import got, { Headers } from 'got-cjs'
import { Logger } from 'winston'
import {
  DefaultBackoff,
  DefaultCountLimit,
  DefaultMaskProperties,
} from './constants'
import { RexListing, RexAccountUser } from './dtos'
import { RexFeedback } from './dtos/rex-feedback'
import { RexConfig } from './interfaces/rex-config'
import {
  RexGotHttpRequest,
  RexRequestBody,
  RexResponse,
  RexSearchCriteria,
} from './interfaces/rex-http.interface'

export class RexClient {
  countLimit: number
  backoff: number
  customHeaders: Headers
  http: HttpService
  logger: Logger

  constructor(private readonly config: RexConfig) {
    this.countLimit = config.countLimit ?? DefaultCountLimit
    this.backoff = config.backoff ?? DefaultBackoff
    this.customHeaders = config.customHeaders ?? {}

    const winstonLogger =
      config.logger ?? getWinstonLogger(config.defaultLoggerOptions)
    this.http = new HttpService(this.config.baseUrl, this.getAccessToken, {
      logging: {
        logger: winstonLogger,
        maskProperties: DefaultMaskProperties,
      },
      http: {
        headers: this.customHeaders,
        method: 'POST',
        json: {
          limit: this.countLimit,
        },
      },
    })

    this.logger = winstonLogger.child({ context: 'rex-client' })
  }

  async getAccountUsers(criteria?: RexSearchCriteria) {
    this.logger.debug({ method: 'getAccountUsers', criteria })

    return this.paginateSearch<RexAccountUser>(
      'account-users/search',
      RexAccountUser,
      criteria,
    )
  }

  async getFeedbacks(criteria?: RexSearchCriteria) {
    this.logger.debug({ method: 'getFeedbacks', criteria })

    return this.paginateSearch<RexFeedback>(
      'feedback/search',
      RexFeedback,
      criteria,
    )
  }

  async getListings(criteria?: RexSearchCriteria) {
    this.logger.debug({ method: 'getListings', criteria })

    return this.paginateSearch<RexListing>(
      'listings/search',
      RexListing,
      criteria,
    )
  }

  async getCustomFieldDefinition(): Promise<
    Record<string, boolean | string | any>
  > {
    this.logger.debug({ method: 'getCustomFieldDefinition' })

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
    path: string,
    dtoConstructor?: DtoConstructor<Array<TResult>>,
    params?: RexSearchCriteria,
  ): Promise<AsyncIterableIterator<TResult>> {
    let count = 1
    const requestJson = this.createSearchBody(this.countLimit, params)
    const url = this.http.urlFromPath(path)

    const response: any = this.http.http.paginate<TResult>(url, {
      json: requestJson,
      pagination: {
        transform: (response): Array<TResult> => {
          const rex = response.body as RexResponse<TResult>
          const rows = plainToDto<Array<TResult>>(
            rex.result.rows,
            dtoConstructor,
          )
          return rows
        },
        paginate: ({ currentItems }) => {
          const numberOfItems = currentItems.length
          if (numberOfItems < this.countLimit) {
            return false
          } else {
            count += numberOfItems
            return this.getNextPaginateRequest(
              numberOfItems,
              count,
              requestJson,
            )
          }
        },
        backoff: this.backoff,
      },
    })

    return response
  }

  getNextPaginateRequest(
    numberOfItems: number,
    count: number,
    requestParams?: RexRequestBody,
  ): false | RexGotHttpRequest {
    this.logger.debug({
      method: 'getNextPaginateRequest',
      numberOfItems,
      count,
      requestParams,
    })

    if (numberOfItems < this.countLimit) {
      return false
    } else {
      return {
        json: this.createSearchBody(this.countLimit, requestParams, count),
      }
    }
  }

  getAccessToken = async (): Promise<string> => {
    const url = new URL('Authentication/login', this.config.baseUrl)
    const { email, password, accountId } = this.config
    const json = {
      email,
      password,
      account_id: accountId,
    }
    const headers = this.customHeaders

    this.logger.debug({
      method: 'getAccessToken',
      url: url.toString(),
      json: this.http.mask(json),
      headers,
    })

    const response: any = await got
      .post(url, {
        headers,
        json,
      })
      .json()

    return response.result
  }

  private createSearchBody(
    countLimit: number,
    params?: RexSearchCriteria,
    offset = 0,
  ): RexRequestBody {
    this.logger.debug({
      method: 'createSearchBody',
      countLimit,
      params,
      offset,
    })

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
