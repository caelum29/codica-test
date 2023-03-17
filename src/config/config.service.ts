import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { plainToInstance } from 'class-transformer';
import { ConfigModuleOptions } from './config.module';
import { validateSync } from 'class-validator';
import { EnvT } from './templates/env.template';
import { CONFIG_OPTIONS } from './config.options';

@Injectable()
export class ConfigService {
  private readonly e: EnvT;
  constructor(@Inject(CONFIG_OPTIONS) options: ConfigModuleOptions) {
    const envFile = fs.readFileSync(options.envPath).toString();
    const envObj = {};
    envFile.split('\n').forEach((line) => {
      if (!line) return;

      const [key, value] = line.split('=').map((p) => p.trim());
      envObj[key] = value;
    });
    const env = plainToInstance(EnvT, envObj);
    this.validate(env);
    this.e = env;
  }
  get env(): EnvT {
    return this.e;
  }

  private validate(obj: Record<string, any>): void {
    const errors = validateSync(obj, {
      forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
      throw new Error(JSON.stringify(errors[0], null, 2));
    }
  }
}
