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

  describe('.transformPaginateResult', () => {
    const responseBody = {
      result: {
        rows: [1, 2, 3],
      },
    }
    const paginateResponse = {
      body: JSON.stringify(responseBody),
    }
    const paginateIncorrectResponse = {
      body: responseBody,
    }

    it('transform should return the correct result', () => {
      const response = rexHttpService.transformPaginateResult(
        baseUrl,
        paginateResponse,
      )
      expect(response).toStrictEqual(
        expect.arrayContaining(responseBody.result.rows),
      )
    })

    it('transform should return the incorrect result', () => {
      expect(() =>
        rexHttpService.transformPaginateResult(
          baseUrl,
          paginateIncorrectResponse,
        ),
      ).toThrowError()
    })
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
          baseUrl,
          currItems,
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
          baseUrl,
          currentItems,
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
          baseUrl,
          currentItems,
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
