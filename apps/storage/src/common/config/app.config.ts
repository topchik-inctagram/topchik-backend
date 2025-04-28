import { useContainer } from 'class-validator';
import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { filterSetup } from '../filter/global.filter';
import { UploadsModule } from '../../uploads.module';
import { pipesSetup } from '../../../../common/pipe/global.pipe';

export function configApp(app: INestApplication) {
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3001', 'https://gateway.inctagram.world'],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    allowedHeaders: ['Accept', 'Content-Type', 'Authorization'],
  });
  useContainer(app.select(UploadsModule), { fallbackOnErrors: true });

  pipesSetup(app);
  filterSetup(app);
}
