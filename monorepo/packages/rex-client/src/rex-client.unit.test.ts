import { RexListing } from './dtos'
import { RexConfig } from './interfaces'
import { RexSearchCriteria } from './interfaces/rex-search-criteria'
import { RexClient } from './rex-client'

describe('RexClient', () => {
  let rexClient: RexClient

  const baseUrl = 'http://example.com'

  const config: RexConfig = {
    email: 'secretClientId',
    password: 'secretPassword',
    baseUrl,
    countLimit: 3,
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

  describe('getListings', () => {
    it('should return an array of RexListing objects', async () => {
      // Arrange
      rexClient.paginateSearch = jest.fn().mockReturnValueOnce(
        (async function* () {
          yield {
            id: 1,
            name: 'Test Listing 1',
            description: 'This is a test listing',
          },
            yield {
              id: 2,
              name: 'Test Listing 2',
              description: 'This is a test listing',
            }
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
      expect(listings).toEqual([
        {
          id: 1,
          name: 'Test Listing 1',
          description: 'This is a test listing',
        },
        {
          id: 2,
          name: 'Test Listing 2',
          description: 'This is a test listing',
        },
      ])

      expect(rexClient.paginateSearch).toBeCalledWith(
        'listings/search',
        RexListing,
        searchCriteria,
      )
    })
  })

  describe('.getNextPaginateRequest', () => {
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
})
