import { pipesSetup } from '../../../../common/pipe/global.pipe';
import { useContainer } from 'class-validator';
import { AppModule } from '../../app.module';
import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { filterSetup } from './filter/global.filter';

export function configApp(app: INestApplication, domain: string) {
  app.use(cookieParser());

  app.enableCors({
    credentials: true,
    origin: ['http://localhost:5175', 'https://localhost:5175', domain],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    allowedHeaders: [
      'Accept',
      'Content-Type',
      'Authorization',
      'Base-Url',
      'X-Client-IP',
    ],
    exposedHeaders: ['Content-Disposition'],
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  pipesSetup(app);
  filterSetup(app);
}
