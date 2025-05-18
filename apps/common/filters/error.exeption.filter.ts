import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { Environments } from '../config/enviroment.settings';
import { HttpStatus } from './http-status';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (process.env.ENV !== Environments.PRODUCTION) {
      console.error(exception.message);
      response
        .status(HttpStatus.InternalServerError)
        .send({ error: exception.message, stack: exception.stack });
    } else {
      console.error(exception.message);
      response
        .status(HttpStatus.InternalServerError)
        .send('Error! Server is not available!');
    }
  }
}
