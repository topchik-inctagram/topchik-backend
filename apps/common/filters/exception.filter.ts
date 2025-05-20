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
import { DomainError } from '../errors/domain.error';
import { AdaptorError } from '../errors/adaptor.error';
import { RepositoryNotFoundError } from '../errors/repository-not-found.error';
import { ApiError } from '../errors/api.error';
import { ErrorTag } from '../errors/error.tag';

@Catch()
export class CommonExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let errorResponse = new ErrorResponse({
      tag: ErrorTag.INTERNAL_SERVER_ERROR,
      attemptedAt: new Date(),
      message: 'Something went wrong',
      path: request.url,
    });

    if (
      exception instanceof AdaptorError ||
      exception instanceof DomainError ||
      exception instanceof RepositoryNotFoundError ||
      (exception instanceof ApiError && !exception.oauth)
    ) {
      errorResponse = new ErrorResponse({
        ...exception,
        path: request.url,
      });
    }

    if (exception instanceof ApiError && exception.oauth) {
      const redirectUrl = `${origin}/auth/sign-up`;
      console.error(exception);
      return response.redirect(redirectUrl);
    }

    if (exception instanceof HttpException) {
      errorResponse = new ErrorResponse({
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

    response.status(errorResponse.code).json(errorResponse);
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
