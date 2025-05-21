import { EnvironmentVariable } from '../configuration';
import { IsString } from 'class-validator';

export class FrontRedirectSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}

  @IsString()
  PROD_DOMAIN: string = this.environmentVariables.PROD_DOMAIN;

  @IsString()
  PROFILE_REDIRECT: string = this.environmentVariables.PROFILE_REDIRECT;

  @IsString()
  SING_UP_REDIRECT: string = this.environmentVariables.SING_UP_REDIRECT;

  @IsString()
  REGISTRATION_REDIRECT: string =
    this.environmentVariables.REGISTRATION_REDIRECT;

  @IsString()
  RECOVERY_REDIRECT: string = this.environmentVariables.RECOVERY_REDIRECT;
}
