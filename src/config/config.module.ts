import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { CONFIG_OPTIONS } from 'src/config/config.options';

export interface ConfigModuleOptions {
  envPath: string;
}

@Global()
@Module({})
export class ConfigModule {
  static forRoot(
    options: ConfigModuleOptions = {
      envPath: '.env',
    },
  ): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}
