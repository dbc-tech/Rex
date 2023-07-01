import { DefaultLoggerOptions } from '@dbc-tech/http-kit'
import { Headers } from 'got-cjs'
import { Logger } from 'winston'

export interface RexConfig {
  baseUrl: string
  email: string
  password: string
  accountId?: number | null
  logger?: Logger
  defaultLoggerOptions?: DefaultLoggerOptions
  countLimit?: number
  customHeaders?: Headers
  backoff?: number
}
