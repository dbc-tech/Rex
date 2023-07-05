import { HttpService, HttpServiceResponse } from '@dbc-tech/http-kit'
import { createMock } from '@golevelup/ts-jest'
import nock from 'nock'
import { rexAccountUsers } from '../tests/testdata/rex-account-users'
import { rexFeedbacks } from '../tests/testdata/rex-feedbacks'
import { rexListings } from '../tests/testdata/rex-listings'
import { rexTabResults } from '../tests/testdata/rex-tab-results'
import { RexAccountUser, RexFeedback, RexListing } from './dtos'
import { RexConfig } from './interfaces'
import { RexSearchCriteria } from './interfaces/rex-search-criteria'
import { RexResponse } from './interfaces/rex-search-response'
import { RexField, RexGroup, RexTab, RexTabResult } from './interfaces/rex-tab'
import { RexClient } from './rex-client'
import { RexFieldValues } from './types/rex-field-values.type'

describe('RexClient', () => {
  let rexClient: RexClient

  const baseUrl = 'https://example.com/'

  const config: RexConfig = {
    email: 'secretClientId',
    password: 'secretPassword',
    accountId: 1,
    baseUrl,
    countLimit: 3,
    customHeaders: {
      'X-App-Identifier': 'Test',
    },
  }

  beforeEach(() => {
    rexClient = new RexClient(config)
  })

  async function arrayFromAsync<T>(gen: AsyncIterable<T>): Promise<T[]> {
    const out: T[] = []
    for await (const x of gen) {
      out.push(x)
    }
    return out
  }

  describe('getAccountUsers', () => {
    it('should return an array of RexAccountUser objects', async () => {
      // Arrange
      rexClient.paginateSearch = jest.fn().mockReturnValueOnce(
        (async function* () {
          yield rexAccountUsers[0], yield rexAccountUsers[1]
        })(),
      )

      const searchCriteria: RexSearchCriteria = {
        criteria: [
          {
            name: 'name',
            type: '=',
            value: 'Test',
          },
        ],
      }

      // Arrange
      const iterator = await rexClient.getAccountUsers(searchCriteria)

      // Assert
      const accountUsers = await arrayFromAsync(iterator)
      expect(accountUsers).toEqual(rexAccountUsers)

      expect(rexClient.paginateSearch).toBeCalledWith(
        'account-users/search',
        RexAccountUser,
        searchCriteria,
      )
    })
  })

  describe('getFeedbacks', () => {
    it('should return an array of RexFeedback objects', async () => {
      // Arrange
      rexClient.paginateSearch = jest.fn().mockReturnValueOnce(
        (async function* () {
          yield rexFeedbacks[0], yield rexFeedbacks[1]
        })(),
      )

      const searchCriteria: RexSearchCriteria = {
        criteria: [
          {
            name: 'name',
            type: '=',
            value: 'Test',
          },
        ],
      }

      // Arrange
      const iterator = await rexClient.getFeedbacks(searchCriteria)

      // Assert
      const accountUsers = await arrayFromAsync(iterator)
      expect(accountUsers).toEqual(rexFeedbacks)

      expect(rexClient.paginateSearch).toBeCalledWith(
        'feedback/search',
        RexFeedback,
        searchCriteria,
      )
    })
  })

  describe('getListings', () => {
    it('should return an array of RexListing objects', async () => {
      // Arrange
      rexClient.paginateSearch = jest.fn().mockReturnValueOnce(
        (async function* () {
          yield rexListings[0], yield rexListings[1]
        })(),
      )

      const searchCriteria: RexSearchCriteria = {
        criteria: [
          {
            name: 'name',
            type: '=',
            value: 'Test',
          },
        ],
      }

      // Arrange
      const iterator = await rexClient.getListings(searchCriteria)

      // Assert
      const listings = await arrayFromAsync(iterator)
      expect(listings).toEqual(rexListings)

      expect(rexClient.paginateSearch).toBeCalledWith(
        'listings/search',
        RexListing,
        searchCriteria,
      )
    })
  })

  describe('getCustomFieldDefinition', () => {
    it('should call the admin-custom-fields/get-definition endpoint with the correct parameters', async () => {
      // Arrange
      const module_name = 'test_module'
      const include_hidden = true
      const httpMock = createMock<HttpService>()
      rexClient.http = httpMock

      const mockResponse: HttpServiceResponse<RexResponse<RexTabResult>> = {
        data: {
          result: rexTabResults,
          error: undefined,
          correlation: undefined,
        },
        statusCode: 200,
      }
      httpMock.postJson.mockResolvedValueOnce(mockResponse)

      // Act
      const result = await rexClient.getCustomFieldDefinition(
        module_name,
        include_hidden,
      )

      // Assert
      expect(httpMock.postJson).toHaveBeenCalledWith(
        `${baseUrl}admin-custom-fields/get-definition`,
        { module_name, include_hidden },
      )

      expect(result).toEqual(mockResponse.data.result)
    })
  })

  describe('createTab', () => {
    it('should call the admin-custom-fields/create-tab endpoint with the correct parameters', async () => {
      // Arrange
      const module_name = 'test_module'
      const label = 'Test Tab'
      const httpMock = createMock<HttpService>()
      rexClient.http = httpMock

      const mockResponse: HttpServiceResponse<RexResponse<RexTab>> = {
        data: {
          result: rexTabResults[0],
          error: undefined,
          correlation: undefined,
        },
        statusCode: 200,
      }
      httpMock.postJson.mockResolvedValueOnce(mockResponse)

      // Act
      const result = await rexClient.createTab(module_name, label)

      // Assert
      expect(httpMock.postJson).toHaveBeenCalledWith(
        `${baseUrl}admin-custom-fields/create-tab`,
        { data: { module_name, label } },
      )

      expect(result).toEqual(mockResponse.data.result)
    })
  })

  describe('createGroup', () => {
    it('should call the admin-custom-fields/create-group endpoint with the correct parameters', async () => {
      // Arrange
      const tab_id = 1
      const label = 'Test Group'
      const httpMock = createMock<HttpService>()
      rexClient.http = httpMock

      const mockResponse: HttpServiceResponse<RexResponse<RexGroup>> = {
        data: {
          result: rexTabResults.tabs[0].groups[0],
          error: undefined,
          correlation: undefined,
        },
        statusCode: 200,
      }
      httpMock.postJson.mockResolvedValueOnce(mockResponse)

      // Act
      const result = await rexClient.createGroup(tab_id, label)

      // Assert
      expect(httpMock.postJson).toHaveBeenCalledWith(
        `${baseUrl}admin-custom-fields/create-group`,
        { data: { tab_id, label } },
      )

      expect(result).toEqual(mockResponse.data.result)
    })
  })

  describe('createField', () => {
    it('should call the admin-custom-fields/create-field endpoint with the correct parameters', async () => {
      // Arrange
      const group_id = 1
      const label = 'Test Field'
      const field_type_id = 'text'
      const display_as = 'text'
      const httpMock = createMock<HttpService>()
      rexClient.http = httpMock

      const mockResponse: HttpServiceResponse<RexResponse<RexField>> = {
        data: {
          result: rexTabResults.tabs[0].groups[0].fields[0],
          error: undefined,
          correlation: undefined,
        },
        statusCode: 200,
      }
      httpMock.postJson.mockResolvedValueOnce(mockResponse)

      // Act
      const result = await rexClient.createField(
        group_id,
        label,
        field_type_id,
        display_as,
      )

      // Assert
      expect(httpMock.postJson).toHaveBeenCalledWith(
        `${baseUrl}admin-custom-fields/create-field`,
        {
          data: {
            group_id,
            label,
            field_type_id,
            settings: {
              display_as,
            },
          },
        },
      )

      expect(result).toEqual(mockResponse.data.result)
    })
  })

  describe('getFieldValues', () => {
    it('should call the custom-fields/get-values-keyed-by-field-name endpoint with the correct parameters', async () => {
      // Arrange
      const service_name = 'test_service'
      const service_object_id = 1
      const httpMock = createMock<HttpService>()
      rexClient.http = httpMock

      const mockResponse: HttpServiceResponse<RexResponse<RexFieldValues>> = {
        data: {
          result: {
            a: '1',
            b: '2',
          },
          error: undefined,
          correlation: undefined,
        },
        statusCode: 200,
      }
      httpMock.postJson.mockResolvedValueOnce(mockResponse)

      // Act
      const result = await rexClient.getFieldValues(
        service_name,
        service_object_id,
      )

      // Assert
      expect(httpMock.postJson).toHaveBeenCalledWith(
        `${baseUrl}custom-fields/get-values-keyed-by-field-name`,
        { service_name, service_object_id },
      )

      expect(result).toEqual(mockResponse.data.result)
    })
  })

  describe('createFieldValue', () => {
    it('should call the custom-fields/set-field-values endpoint with the correct parameters', async () => {
      // Arrange
      const service_name = 'test_service'
      const service_object_id = 1
      const field = 'test_field'
      const value = 'test_value'
      const httpMock = createMock<HttpService>()
      rexClient.http = httpMock

      const mockResponse: HttpServiceResponse<RexResponse<RexFieldValues>> = {
        data: {
          result: {
            a: '1',
            b: '2',
          },
          error: undefined,
          correlation: undefined,
        },
        statusCode: 200,
      }
      httpMock.postJson.mockResolvedValueOnce(mockResponse)

      // Act
      const result = await rexClient.createFieldValue(
        service_name,
        service_object_id,
        field,
        value,
      )

      // Assert
      expect(httpMock.postJson).toHaveBeenCalledWith(
        `${baseUrl}custom-fields/set-field-values`,
        {
          service_name,
          service_object_id,
          value_map: {
            [field]: value,
          },
        },
      )

      expect(result).toEqual(mockResponse.data.result)
    })
  })

  describe('getNextPaginateRequest', () => {
    const count = 1
    const params = {
      limit: 1,
      offset: 0,
    }

    describe('currentItems.length < countLimit', () => {
      const currItems = [1]
      it('should return false', () => {
        const response = rexClient.getNextPaginateRequest(
          currItems.length,
          count,
          params,
        )
        expect(response).toEqual(false)
      })
    })

    describe('currentItems.length > countLimit', () => {
      const currentItems = [1, 2, 3, 4]

      it('should return a body object', () => {
        const response = rexClient.getNextPaginateRequest(
          currentItems.length,
          count,
          params,
        )
        expect(response).toEqual({
          json: {
            limit: 3,
            offset: 1,
          },
        })
      })
    })

    describe('when there are no extra params', () => {
      const currentItems = [1, 2, 3, 4]

      it('should return a body object', () => {
        const response = rexClient.getNextPaginateRequest(
          currentItems.length,
          count,
        )
        expect(response).toEqual({
          json: {
            limit: 3,
            offset: 1,
          },
        })
      })
    })
  })

  describe('getAccessToken', () => {
    it('should call the Authentication/login endpoint with the correct parameters', async () => {
      // Arrange
      nock(baseUrl, {
        reqheaders: {
          'X-App-Identifier': 'Test',
        },
      })
        .post('/Authentication/login', {
          email: config.email,
          password: config.password,
          account_id: config.accountId,
        })
        .reply(200, {
          result: 'test_token',
        })

      // Act
      const result = await rexClient.getAccessToken()

      // Assert
      expect(result).toEqual('test_token')
    })
  })
})
