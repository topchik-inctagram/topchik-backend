import { BaseConfiguration } from '../../../../common/config/base.configuration';
import { ValidateNested } from 'class-validator';
import { BucketSettings } from './settings/bucket.settings';
import { ApiSettings } from '../../../../common/config/api.settings';
import { DatabaseSettings } from '../../../../common/config/data-base.settings';
import {
  Environments,
  EnvironmentSettings,
} from '../../../../common/config/enviroment.settings';

export type EnvironmentVariable = Record<string, string | undefined>;

type PropertyNames<T> = {
  [K in keyof T]-?: T[K] extends (...args: any[]) => any ? never : K;
}[keyof T];

export type ConfigurationType = Pick<
  StorageConfiguration & BaseConfiguration,
  PropertyNames<StorageConfiguration>
>;

export class StorageConfiguration extends BaseConfiguration {
  @ValidateNested()
  bucketSettings: BucketSettings;

  private constructor(configuration: ConfigurationType) {
    super();
    Object.assign(this, configuration);
  }

  static createConfig(
    environmentVariables: Record<string, string>,
  ): StorageConfiguration {
    const config = new this({
      // Инициализация настроек
      apiSettings: new ApiSettings(environmentVariables),
      databaseSettings: new DatabaseSettings(environmentVariables),
      environmentSettings: new EnvironmentSettings(environmentVariables),
      bucketSettings: new BucketSettings(environmentVariables),
    });
    config.checkError();
    return config;
  }
}

export default () => {
  const environmentVariables = process.env as EnvironmentVariable;
  console.log('process.env.ENV =', environmentVariables.ENV);
  return StorageConfiguration.createConfig(environmentVariables);
};

export const getFilePath = (env: Environments) => {
  switch (env) {
    case Environments.TEST:
      return '.env.storage.test';
    case Environments.STAGING:
      return '.env.storage.staging';
    case Environments.DEVELOPMENT:
      return '.env.storage.develop';
    case Environments.PRODUCTION:
      return '.env.storage.production';
    default:
      return '.env';
  }
};
