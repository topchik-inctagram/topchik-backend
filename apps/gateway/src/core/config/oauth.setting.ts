import { EnvironmentVariable } from './configuration';
import { IsString } from 'class-validator';

export class OauthSetting {
  constructor(private environmentVariables: EnvironmentVariable) {}

  @IsString()
  OAUTH_GOOGLE_ID: string = this.environmentVariables.OAUTH_GOOGLE_ID;

  @IsString()
  OAUTH_GOOGLE_SECRET: string = this.environmentVariables.OAUTH_GOOGLE_SECRET;

  @IsString()
  OAUTH_GOOGLE_REDIRECT_URL: string =
    this.environmentVariables.OAUTH_GOOGLE_REDIRECT_URL;

  @IsString()
  GITHUB_CLIENT_ID: string = this.environmentVariables.GITHUB_CLIENT_ID;

  @IsString()
  GITHUB_CLIENT_SECRET: string = this.environmentVariables.GITHUB_CLIENT_SECRET;

  @IsString()
  GITHUB_CALLBACK_URL: string = this.environmentVariables.GITHUB_CALLBACK_URL;

  @IsString()
  GITHUB_API_GET_EMAIL_URL: string =
    this.environmentVariables.GITHUB_API_GET_EMAIL_URL;
}
