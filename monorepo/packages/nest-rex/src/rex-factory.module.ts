// Concepts borrowed from https://github.com/nestjs/jwt/blob/master/lib/jwt.module.ts
import {
  DynamicModule,
  Module,
  ModuleMetadata,
  Provider,
  Type,
} from '@nestjs/common'
import { REX_FACTORY_CONFIG } from './constants'
import { RexFactory } from './rex-factory'
import { RexFactoryConfig } from './rex-factory.config'

export function createOptionsProvider(options: RexFactoryConfig): any[] {
  return [{ provide: REX_FACTORY_CONFIG, useValue: options || {} }]
}

export interface RexFactoryOptionsFactory {
  create(): Promise<RexFactoryConfig> | RexFactoryConfig
}

export interface RexFactoryModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  global?: boolean
  useExisting?: Type<RexFactoryOptionsFactory>
  useClass?: Type<RexFactoryOptionsFactory>
  useFactory?: (...args: any[]) => Promise<RexFactoryConfig> | RexFactoryConfig
  inject?: any[]
}

@Module({
  providers: [RexFactory],
  exports: [RexFactory],
})
export class RexFactoryModule {
  static register(options: RexFactoryConfig): DynamicModule {
    return {
      module: RexFactoryModule,
      global: options.global,
      providers: createOptionsProvider(options),
    }
  }

  static registerAsync(options: RexFactoryModuleAsyncOptions): DynamicModule {
    return {
      module: RexFactoryModule,
      global: options.global,
      imports: options.imports || [],
      providers: this.createAsyncProviders(options),
    }
  }

  private static createAsyncProviders(
    options: RexFactoryModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)]
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ]
  }

  private static createAsyncOptionsProvider(
    options: RexFactoryModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: REX_FACTORY_CONFIG,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }
    return {
      provide: REX_FACTORY_CONFIG,
      useFactory: async (optionsFactory: RexFactoryOptionsFactory) =>
        await optionsFactory.create(),
      inject: [options.useExisting || options.useClass],
    }
  }
}
