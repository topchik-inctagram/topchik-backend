import { EnvironmentVariable } from '../../gateway/src/core/config/configuration';
import { IsNumber, IsString } from 'class-validator';

export class ApiSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}

  @IsNumber()
  PORT: number = Number(this.environmentVariables.PORT);

  @IsString()
  API_PREFIX: string = this.environmentVariables.API_PREFIX;
}
