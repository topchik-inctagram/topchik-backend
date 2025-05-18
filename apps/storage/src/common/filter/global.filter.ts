import { INestApplication } from '@nestjs/common';
import { ErrorExceptionFilter } from '../../../../common/filters/error.exeption.filter';
import { HttpExceptionFilter } from '../../../../common/filters/http.exeption.filter';
import { AdaptorExceptionFilter } from '../../../../common/filters/adaptor.exception.filter';
import { ApiExceptionFilter } from '../../../../common/filters/api.exception.filter';

export function filterSetup(app: INestApplication) {
  app.useGlobalFilters(
    new ErrorExceptionFilter(),
    new HttpExceptionFilter(),
    new AdaptorExceptionFilter(),
    new ApiExceptionFilter(),
  );
}
