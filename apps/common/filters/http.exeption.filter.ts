import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BadRequestResponse } from '../views/response.view';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof BadRequestException) {
      const errors: any = exception.getResponse();

      return response
        .status(exception.getStatus())
        .json(new BadRequestResponse(errors.message));
    }

    return response.status(exception.getStatus()).json({
      errorsMessage: exception.message,
    });
  }
}
