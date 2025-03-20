import { INestApplication } from '@nestjs/common';
import { CustomExceptionFilter } from '../../../../../common/filters/custom.exeption.filter';
import { ErrorExceptionFilter } from '../../../../../common/filters/error.exeption.filter';
import { HttpExceptionFilter } from '../../../../../common/filters/http.exeption.filter';

export function filterSetup(app: INestApplication) {
  app.useGlobalFilters(
    new ErrorExceptionFilter(),
    new HttpExceptionFilter(),
    new CustomExceptionFilter(),
  );
}
