import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import {
  BadRequestError,
  BadRequestErrors,
  CustomError,
} from '../exeptions/custom.exeption';
import { BadRequestResponse } from '../views/response.view';

@Catch(CustomError)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: CustomError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    //const request = ctx.getRequest<Request>();

    if (exception instanceof BadRequestErrors) {
      return response
        .status(exception.code)
        .json(new BadRequestResponse(exception.getError));
    }

    if (exception instanceof BadRequestError) {
      return response
        .status(exception.code)
        .json(new BadRequestResponse(exception.getError));
    }

    response.status(exception.code).json({
      errorsMessage: exception.message,
    });
  }
}
