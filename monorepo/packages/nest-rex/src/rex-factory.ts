import { RexClient } from '@dbc-tech/rex-client'
import { Inject, Injectable } from '@nestjs/common'
import { Logger } from 'winston'
import { REX_FACTORY_CONFIG } from './constants'
import { RexFactoryConfig } from './rex-factory.config'

@Injectable()
export class RexFactory {
  constructor(
    @Inject(REX_FACTORY_CONFIG)
    private readonly config: RexFactoryConfig,
  ) {}

  create(
    email: string,
    password: string,
    accountId?: number,
    customHeaders?: Record<string, string | string[] | undefined>,
    logger?: Logger,
  ) {
    return new RexClient({
      baseUrl: this.config.baseUrl,
      email,
      password,
      accountId,
      customHeaders,
      logger: logger ?? this.config.logger,
    })
  }
}
