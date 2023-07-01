import { RexConfig } from './interfaces'
import { RexClient } from './rex-client'

describe('RexClient', () => {
  let rexHttpService: RexClient

  const baseUrl = 'http://example.com'

  const config: RexConfig = {
    email: 'secretClientId',
    password: 'secretPassword',
    baseUrl,
    countLimit: 3,
  }

  beforeEach(() => {
    rexHttpService = new RexClient(config)
  })

  describe('.getNextPaginateRequest', () => {
    const count = 1
    const params = {
      criteria: [{ foo: 'bar' }],
      limit: 1,
    }

    describe('currentItems.length < countLimit', () => {
      const currItems = [1]
      it('should return false', () => {
        const response = rexHttpService.getNextPaginateRequest(
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
        const response = rexHttpService.getNextPaginateRequest(
          currentItems.length,
          count,
          params,
        )
        expect(response).toEqual({
          json: {
            criteria: [
              {
                foo: 'bar',
              },
            ],
            limit: 3,
            offset: 1,
          },
        })
      })
    })

    describe('when there are no extra params', () => {
      const currentItems = [1, 2, 3, 4]

      it('should return a body object', () => {
        const response = rexHttpService.getNextPaginateRequest(
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
