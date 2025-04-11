import {
  Environments,
  EnvironmentSettings,
} from '../../../../common/config/enviroment.settings';
import { ValidateNested } from 'class-validator';
import { ApiSettings } from '../../../../common/config/api.settings';
import { MailSettings } from './mail.settings';
import { DatabaseSettings } from '../../../../common/config/data-base.settings';
import { JwtSettings } from './jwt.settings';
import { OauthSetting } from './oauth.setting';
import { RecaptchaSettings } from './recaptcha.settings';
import { FrontRedirectSettings } from './front-redirect.settings';
import { StorageServiceSettings } from './storage-service.settings';
import { BaseConfiguration } from '../../../../common/config/base.configuration';
import { join } from 'path';
import { existsSync } from 'fs';

export type EnvironmentVariable = Record<string, string | undefined>;

type PropertyNames<T> = {
  [K in keyof T]-?: T[K] extends (...args: any[]) => any ? never : K;
}[keyof T];

export type ConfigurationType = Pick<
  Configuration,
  PropertyNames<Configuration>
>;

export class Configuration extends BaseConfiguration {
  @ValidateNested()
  mailSettings: MailSettings;
  @ValidateNested()
  jwtSettings: JwtSettings;
  @ValidateNested()
  oauthSetting: OauthSetting;
  @ValidateNested()
  recaptchaSetting: RecaptchaSettings;
  @ValidateNested()
  frontRedirectSettings: FrontRedirectSettings;
  @ValidateNested()
  storageServiceSettings: StorageServiceSettings;

  private constructor(configuration: ConfigurationType) {
    super();
    Object.assign(this, configuration);
  }

  static createConfig(
    environmentVariables: Record<string, string>,
  ): Configuration {
    const config = new this({
      // Инициализация настроек
      apiSettings: new ApiSettings(environmentVariables),
      databaseSettings: new DatabaseSettings(environmentVariables),
      environmentSettings: new EnvironmentSettings(environmentVariables),
      mailSettings: new MailSettings(environmentVariables),
      jwtSettings: new JwtSettings(environmentVariables),
      oauthSetting: new OauthSetting(environmentVariables),
      recaptchaSetting: new RecaptchaSettings(environmentVariables),
      frontRedirectSettings: new FrontRedirectSettings(environmentVariables),
      storageServiceSettings: new StorageServiceSettings(environmentVariables),
    });
    config.checkError();

    return config;
  }
}

export default () => {
  const environmentVariables = process.env as EnvironmentVariable;
  console.log('process.env.ENV =', environmentVariables.ENV);
  return Configuration.createConfig(environmentVariables);
};

function checkTestFiles(): string {
  const localTestPath = join(process.cwd(), '.env.gateway.test.local');
  return existsSync(localTestPath)
    ? '.env.gateway.test.local'
    : '.env.gateway.test';
}

export const getFilePath = (env: Environments) => {
  switch (env) {
    case Environments.TEST:
      return checkTestFiles();
    case Environments.STAGING:
      return '.env.gateway.staging';
    case Environments.DEVELOPMENT:
      return '.env.gateway.develop';
    case Environments.PRODUCTION:
      return '.env.gateway.production';
    default:
      return '.env.a';
  }
};
