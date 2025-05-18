import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../views/response.view';
import { AdaptorError } from '../errors/adaptor.error';

@Catch(AdaptorError)
export class AdaptorExceptionFilter implements ExceptionFilter {
  catch(exception: AdaptorError, host: ArgumentsHost) {
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
