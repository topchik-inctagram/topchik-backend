import { INestApplication } from '@nestjs/common';
import { CommonExceptionFilter } from './exception.filter';

export function filterSetup(app: INestApplication) {
  app.useGlobalFilters(new CommonExceptionFilter());
}
