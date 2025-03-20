import { BaseConfiguration } from '../../../../common/config/base.configuration';
import { ApiSettings } from '../../../../common/config/api.settings';
import { DatabaseSettings } from '../../../../common/config/data-base.settings';
import {
  Environments,
  EnvironmentSettings,
} from '../../../../common/config/enviroment.settings';
import { PaymentProvidersSettings } from './payment-providers.settings';

export type EnvironmentVariable = Record<string, string | undefined>;

type PropertyNames<T> = {
  [K in keyof T]-?: T[K] extends (...args: any[]) => any ? never : K;
}[keyof T];

export type ConfigurationType = Pick<
  PaymentsConfiguration,
  PropertyNames<PaymentsConfiguration>
>;

export class PaymentsConfiguration extends BaseConfiguration {
  paymentProvidersSettings: PaymentProvidersSettings;

  private constructor(configuration: ConfigurationType) {
    super();
    Object.assign(this, configuration);
  }

  static createConfig(
    environmentVariables: Record<string, string>,
  ): PaymentsConfiguration {
    const config = new this({
      // Инициализация настроек
      apiSettings: new ApiSettings(environmentVariables),
      databaseSettings: new DatabaseSettings(environmentVariables),
      environmentSettings: new EnvironmentSettings(environmentVariables),
      paymentProvidersSettings: new PaymentProvidersSettings(
        environmentVariables,
      ),
    });
    config.checkError();
    return config;
  }
}

export default () => {
  const environmentVariables = process.env as EnvironmentVariable;
  console.log('process.env.ENV =', environmentVariables.ENV);
  return PaymentsConfiguration.createConfig(environmentVariables);
};

export const getFilePath = (env: Environments) => {
  switch (env) {
    case Environments.TEST:
      return '.env.payments.test';
    case Environments.STAGING:
      return '.env.payments.staging';
    case Environments.DEVELOPMENT:
      return '.env.payments.develop';
    case Environments.PRODUCTION:
      return '.env.payments.production';
    default:
      return '.env';
  }
};
