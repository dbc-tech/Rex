import { arrayFromAsync } from './async-utils'

describe('arrayFromAsync', () => {
  it('should return an empty array for an empty AsyncIterable', async () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const gen = (async function* () {})()
    const result = await arrayFromAsync(gen)
    expect(result).toEqual([])
  })

  it('should return an array of values for a non-empty AsyncIterable', async () => {
    const gen = (async function* () {
      yield 1
      yield 2
      yield 3
    })()
    const result = await arrayFromAsync(gen)
    expect(result).toEqual([1, 2, 3])
  })

  it('should handle an AsyncIterable that throws an error', async () => {
    const gen = (async function* () {
      yield 1
      throw new Error('Test error')
    })()
    await expect(arrayFromAsync(gen)).rejects.toThrow('Test error')
  })
})
