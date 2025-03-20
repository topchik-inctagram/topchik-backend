import { NestFactory } from '@nestjs/core';
import { UploadsModule } from './uploads.module';
import { ConfigService } from '@nestjs/config';
import { configApp } from './core/config/app.config';
import { StorageConfiguration } from './core/config/storage-configuration';
import { getAppConnectSettings } from '../../common/config/get-app-connect-settings';
import { AppLoggerService } from '../../common/logger/logger.service';

async function bootstrap() {
  const appLogger = new AppLoggerService();
  const app = await NestFactory.create(UploadsModule, {
    logger: appLogger,
  });
  configApp(app);
  const configService = app.get(ConfigService<StorageConfiguration, true>);

  const { port, apiPrefix } = await getAppConnectSettings(app, configService);

  appLogger.log(`PORT: ${port}`);
  appLogger.log(`prefix: ${apiPrefix}`);

  await app.init();
  await app.listen(port);
}

bootstrap();
