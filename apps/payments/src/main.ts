import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { ConfigService } from '@nestjs/config';
import { getAppConnectSettings } from '../../common/config/get-app-connect-settings';
import { PaymentsConfiguration } from './core/config/payments-configuration';
import { configApp } from './core/config/app.config';
import { AppLoggerService } from '../../common/logger/logger.service';

async function bootstrap() {
  const appLogger = new AppLoggerService();
  const app = await NestFactory.create(PaymentsModule, {
    logger: appLogger,
  });
  configApp(app);
  const configService = app.get(ConfigService<PaymentsConfiguration, true>);

  const { port, apiPrefix } = await getAppConnectSettings(app, configService);

  appLogger.log(`PORT: ${port}`);
  appLogger.log(`prefix: ${apiPrefix}`);

  await app.init();
  await app.listen(port);
}

bootstrap();
