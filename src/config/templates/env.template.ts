import { IsNumberString, IsString } from 'class-validator';

export class EnvT {
  @IsNumberString()
  PORT: string;
  @IsNumberString()
  PG_PORT: string;
  @IsString()
  PG_HOST: string;
  @IsString()
  PG_USERNAME: string;
  @IsString()
  PG_PASSWORD: string;
  @IsString()
  PG_DATABASE: string;
}
