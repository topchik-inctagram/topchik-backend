import { EnvironmentVariable } from './configuration';
import { IsString } from 'class-validator';

export class JwtSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}

  @IsString()
  ACCESS_TOKEN_SECRET: string = this.environmentVariables.ACCESS_TOKEN_SECRET;
  @IsString()
  REFRESH_TOKEN_SECRET: string = this.environmentVariables.REFRESH_TOKEN_SECRET;
  @IsString()
  ACCESS_TOKEN_EXP: string = this.environmentVariables.ACCESS_TOKEN_EXP;
  @IsString()
  REFRESH_TOKEN_EXP: string = this.environmentVariables.REFRESH_TOKEN_EXP;
}
