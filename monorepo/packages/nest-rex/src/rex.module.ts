import { RexClient } from '@dbc-tech/rex-client'
import {
  DynamicModule,
  Module,
  ModuleMetadata,
  Provider,
  Type,
} from '@nestjs/common'
import { RexConfig } from './rex.config'

export interface RexModuleFactory {
  create(): Promise<RexClient> | RexClient
}

export interface RexModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  global?: boolean
  useExisting?: Type<RexModuleFactory>
  useClass?: Type<RexModuleFactory>
  useFactory?: (...args: any[]) => Promise<RexClient> | RexClient
  inject?: any[]
}

@Module({
  exports: [RexClient],
})
export class RexModule {
  static register(options: RexConfig): DynamicModule {
    return {
      module: RexModule,
      global: options.global,
      providers: [
        {
          provide: RexClient,
          useValue: new RexClient(options),
        },
      ],
    }
  }

  static registerAsync(options: RexModuleAsyncOptions): DynamicModule {
    return {
      module: RexModule,
      global: options.global,
      imports: options.imports || [],
      providers: this.createAsyncProviders(options),
    }
  }

  private static createAsyncProviders(
    options: RexModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncProvider(options)]
    }
    return [
      this.createAsyncProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ]
  }

  private static createAsyncProvider(options: RexModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: RexClient,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }
    return {
      provide: RexClient,
      useFactory: async (optionsFactory: RexModuleFactory) =>
        await optionsFactory.create(),
      inject: [options.useExisting || options.useClass],
    }
  }
}
