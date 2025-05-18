import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ApiError } from '../errors/api.error';
import { ErrorResponse } from '../views/response.view';

@Catch(ApiError)
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: ApiError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const origin = 'https://topchik.uk/';

    if (exception.oauth) {
      const redirectUrl = `${origin}/auth/sign-up`;
      console.error(exception);
      return response.redirect(redirectUrl);
    } else {
      const errorResponse = new ErrorResponse({
        ...exception,
        path: request.url,
      });

      response.status(errorResponse.code).json(errorResponse);
    }
  }
}
