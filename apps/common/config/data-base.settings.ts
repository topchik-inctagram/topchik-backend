import { EnvironmentVariable } from '../../gateway/src/core/config/configuration';
import { IsString } from 'class-validator';

export class DatabaseSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}

  @IsString()
  DATABASE_URL: string = this.environmentVariables.DATABASE_URL;
}
