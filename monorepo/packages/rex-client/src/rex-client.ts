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
import { RexGotRequest } from './interfaces/rex-got-request.ts'
import { RexPagedSearch } from './interfaces/rex-paged-search'
import { RexSearchCriteria } from './interfaces/rex-search-criteria'
import { RexResponse, RexSearchResult } from './interfaces/rex-search-response'
import { RexField, RexGroup, RexTab, RexTabResult } from './interfaces/rex-tab'
import { RexFieldValues } from './types/rex-field-values.type'

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

  async getCustomFieldDefinition(module_name: string, include_hidden: boolean) {
    this.logger.debug({
      method: 'getCustomFieldDefinition',
      module_name,
      include_hidden,
    })

    const body = {
      module_name,
      include_hidden,
    }

    const response = await this.http.postJson<RexResponse<RexTabResult>>(
      this.http.urlFromPath('admin-custom-fields/get-definition'),
      body,
    )

    return response.data.result
  }

  async createTab(module_name: string, label: string) {
    this.logger.debug({ method: 'createTab', module_name, label })

    const body = {
      data: {
        module_name,
        label,
      },
    }

    const response = await this.http.postJson<RexResponse<RexTab>>(
      this.http.urlFromPath('admin-custom-fields/create-tab'),
      body,
    )

    return response.data.result
  }

  async createGroup(tab_id: number, label: string) {
    this.logger.debug({ method: 'createGroup', tab_id, label })

    const body = {
      data: {
        tab_id,
        label,
      },
    }

    const response = await this.http.postJson<RexResponse<RexGroup>>(
      this.http.urlFromPath('admin-custom-fields/create-group'),
      body,
    )

    return response.data.result
  }

  async createField(
    group_id: number,
    label: string,
    field_type_id: string,
    display_as: string,
  ) {
    this.logger.debug({
      method: 'createField',
      group_id,
      label,
      field_type_id,
      display_as,
    })

    const body = {
      data: {
        group_id,
        label,
        field_type_id,
        settings: {
          display_as,
        },
      },
    }

    const response = await this.http.postJson<RexResponse<RexField>>(
      this.http.urlFromPath('admin-custom-fields/create-field'),
      body,
    )

    return response.data.result
  }

  async getFieldValues(service_name: string, service_object_id: unknown) {
    this.logger.debug({
      method: 'getFieldValues',
      service_name,
      service_object_id,
    })

    const body = {
      service_name,
      service_object_id,
    }

    const response = await this.http.postJson<RexResponse<RexFieldValues>>(
      this.http.urlFromPath('custom-fields/get-values-keyed-by-field-name'),
      body,
    )

    return response.data.result
  }

  async createFieldValue(
    service_name: string,
    service_object_id: unknown,
    field: string,
    value: unknown,
  ) {
    this.logger.debug({
      method: 'createFieldValue',
      service_name,
      service_object_id,
      field,
      value,
    })

    const body = {
      service_name,
      service_object_id,
      value_map: {
        [field]: value,
      },
    }

    const response = await this.http.postJson<RexResponse<RexFieldValues>>(
      this.http.urlFromPath('custom-fields/set-field-values'),
      body,
    )

    return response.data.result
  }

  async paginateSearch<TResult>(
    path: string,
    dtoConstructor?: DtoConstructor<Array<TResult>>,
    params?: RexSearchCriteria,
  ): Promise<AsyncIterableIterator<TResult>> {
    let count = 1
    const requestJson = this.createSearchBody(this.countLimit, params)
    const url = this.http.urlFromPath(path)

    const response = this.http.paginate<TResult>(url, {
      json: requestJson,
      pagination: {
        transform: (response): Array<TResult> => {
          const rex = response.body as RexResponse<RexSearchResult<TResult>>
          return plainToDto<Array<TResult>>(rex.result.rows, dtoConstructor)
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
    requestParams?: RexPagedSearch,
  ): false | RexGotRequest<RexPagedSearch> {
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

    const response = await got
      .post(url, {
        headers,
        json,
      })
      .json<{ result: string }>()

    return response.result
  }

  private createSearchBody(
    countLimit: number,
    params?: RexSearchCriteria,
    offset = 0,
  ): RexPagedSearch {
    if (params) {
      const req = {
        ...params,
        limit: countLimit,
        offset,
      }
      this.logger.debug({
        method: 'createSearchBody',
        countLimit,
        params,
        offset,
        req,
      })
      return req
    }

    const req = {
      limit: countLimit,
      offset,
    }
    this.logger.debug({
      method: 'createSearchBody',
      countLimit,
      params,
      offset,
      req,
    })
    return req
  }
}
