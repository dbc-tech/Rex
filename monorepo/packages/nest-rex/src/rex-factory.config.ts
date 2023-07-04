import { Logger } from 'winston'

export interface RexFactoryConfig {
  global?: boolean
  baseUrl: string
  logger?: Logger
}
