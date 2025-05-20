import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { PaymentsModule } from '../../payments.module';
import { pipesSetup } from '../../../../common/pipe/global.pipe';
import { filterSetup } from '../../../../common/filters/filter-setup';

export function configApp(app: INestApplication) {
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3001', 'https://gateway.inctagram.world'],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    allowedHeaders: ['Accept', 'Content-Type', 'Authorization'],
  });
  useContainer(app.select(PaymentsModule), { fallbackOnErrors: true });

  pipesSetup(app);
  filterSetup(app);
}
