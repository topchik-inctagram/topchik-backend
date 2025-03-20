import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ExceptionCodes } from '../exeptions/custom.exeption';
import { Environments } from '../config/enviroment.settings';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (process.env.ENV !== Environments.PRODUCTION) {
      console.error(exception.message);
      response
        .status(ExceptionCodes.InternalServerError)
        .send({ error: exception.message, stack: exception.stack });
    } else {
      console.error(exception.message);
      response
        .status(ExceptionCodes.InternalServerError)
        .send('Error! Server is not available!');
    }
  }
}
