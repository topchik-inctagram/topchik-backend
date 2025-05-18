import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../views/response.view';
import { RepositoryNotFoundError } from '../errors/repository-not-found.error';

@Catch(RepositoryNotFoundError)
export class RepositoryExceptionFilter implements ExceptionFilter {
  catch(exception: RepositoryNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = new ErrorResponse({
      ...exception,
      path: request.url,
    });

    response.status(errorResponse.code).json(errorResponse);
  }
}
