import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseConfiguration } from './base.configuration';

export async function getAppConnectSettings(
  app: INestApplication,
  configService: ConfigService<BaseConfiguration, true>,
) {
  const apiPrefix = configService.get('apiSettings.API_PREFIX', {
    infer: true,
  });
  const port = configService.get('apiSettings.PORT', { infer: true });

  app.setGlobalPrefix(apiPrefix);

  return { port, apiPrefix };
}
