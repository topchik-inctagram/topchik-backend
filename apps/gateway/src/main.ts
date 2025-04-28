import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configApp } from './common/app/app-setup';
import { ConfigService } from '@nestjs/config';
import { Configuration } from './common/config/configuration';
import { swaggerSetup } from './common/swagger/global.swagger';
import { getAppConnectSettings } from '../../common/config/get-app-connect-settings';
import { AppLoggerService } from '../../common/logger/logger.service';

async function bootstrap() {
  const appLogger = new AppLoggerService();

  const app = await NestFactory.create(AppModule, {
    logger: appLogger,
  });

  const configService = app.get(ConfigService<Configuration, true>);

  const { apiPrefix, port, domain } = await getAppConnectSettings(
    app,
    configService,
  );

  configApp(app, domain);

  swaggerSetup(app, apiPrefix);

  appLogger.log(`DOMAIN: ${domain}`);
  appLogger.log(`PORT: ${port}`);
  appLogger.log(`prefix: ${apiPrefix}`);

  await app.init();
  await app.listen(port);
}

bootstrap();
