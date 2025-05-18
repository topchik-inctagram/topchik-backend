import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../views/response.view';
import { ErrorTag } from '../errors/error.tag';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = new ErrorResponse({
      tag: this.getErrorTag(exception.getStatus()),
      attemptedAt: new Date(),
      message: exception.message,
      path: request.url,
    });

    if (exception instanceof BadRequestException) {
      const errors: any = exception.getResponse();

      return response
        .status(exception.getStatus())
        .json({ ...errorResponse, errors, code: exception.getStatus() });
    }

    return response
      .status(exception.getStatus())
      .json({ ...errorResponse, code: exception.getStatus() });
  }

  private getErrorTag(httpStatus: HttpStatus) {
    switch (httpStatus) {
      case HttpStatus.BAD_REQUEST:
        return ErrorTag.VALIDATION_FAILED;
      case HttpStatus.UNAUTHORIZED:
        return ErrorTag.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ErrorTag.PERMISSION_DENIED;
      case HttpStatus.NOT_FOUND:
        return ErrorTag.NOT_FOUND;
      case HttpStatus.BAD_GATEWAY:
        return ErrorTag.BAD_GATEWAY;
      case HttpStatus.SERVICE_UNAVAILABLE:
        return ErrorTag.SERVICE_UNAVAILABLE;
      default:
        return ErrorTag.INTERNAL_SERVER_ERROR;
    }
  }
}
