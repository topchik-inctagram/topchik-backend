import { EnvironmentVariable } from '../configuration';
import { IsString } from 'class-validator';

export class MailSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}

  @IsString()
  MAIL_USER: string = this.environmentVariables.MAIL_USER;

  @IsString()
  MAIL_PASSWORD: string = this.environmentVariables.MAIL_PASSWORD;

  @IsString()
  REGISTRATION_URL: string = this.environmentVariables.REGISTRATION_URL;

  @IsString()
  RECOVERY_URL: string = this.environmentVariables.RECOVERY_URL;
}
