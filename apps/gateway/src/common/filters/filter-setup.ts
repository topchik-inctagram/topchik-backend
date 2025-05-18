import { INestApplication } from '@nestjs/common';
import { DomainExceptionFilter } from '../../../../common/filters/domain.exception.filter';
import { ErrorExceptionFilter } from '../../../../common/filters/error.exeption.filter';
import { HttpExceptionFilter } from '../../../../common/filters/http.exeption.filter';
import { AdaptorExceptionFilter } from '../../../../common/filters/adaptor.exception.filter';
import { RepositoryExceptionFilter } from '../../../../common/filters/repository.exception.filter';
import { ApiExceptionFilter } from '../../../../common/filters/api.exception.filter';

export function filterSetup(app: INestApplication) {
  app.useGlobalFilters(
    new ErrorExceptionFilter(),
    new HttpExceptionFilter(),
    new DomainExceptionFilter(),
    new AdaptorExceptionFilter(),
    new RepositoryExceptionFilter(),
    new ApiExceptionFilter(),
  );
}
