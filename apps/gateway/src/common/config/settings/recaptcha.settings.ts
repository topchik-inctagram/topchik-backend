import { EnvironmentVariable } from '../configuration';
import { IsString } from 'class-validator';

export class RecaptchaSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}

  @IsString()
  RECAPTCHA_KEY: string = this.environmentVariables.RECAPTCHA_KEY;

  @IsString()
  RECAPTCHA_URL: string = this.environmentVariables.RECAPTCHA_URL;
}
