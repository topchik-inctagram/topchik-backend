import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainError } from '../errors/domain.error';
import { ErrorResponse } from '../views/response.view';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
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
