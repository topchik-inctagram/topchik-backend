import { INestApplication } from '@nestjs/common';
import { DomainExceptionFilter } from '../../filters/domain.exeption.filter';
import { CustomOAuthExceptionFilter } from '../../filters/oauth.exeption.filter';
import { CustomExceptionFilter } from '../../../../../common/filters/custom.exeption.filter';
import { ErrorExceptionFilter } from '../../../../../common/filters/error.exeption.filter';
import { HttpExceptionFilter } from '../../../../../common/filters/http.exeption.filter';

export function filterSetup(app: INestApplication) {
  app.useGlobalFilters(
    new ErrorExceptionFilter(),
    new HttpExceptionFilter(),
    new CustomExceptionFilter(),
    new DomainExceptionFilter(),
    new CustomOAuthExceptionFilter(),
  );
}
