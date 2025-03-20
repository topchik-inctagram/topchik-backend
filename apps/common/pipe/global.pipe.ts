import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationPipeError } from '../views/response.view';
import { ValidationError } from 'class-validator';

export function pipesSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const errorsForResponse: ValidationPipeError[] = errors.flatMap(
          (error) => {
            const constraints = error.constraints ?? [];
            return Object.entries(constraints).map(
              ([, value]): ValidationPipeError =>
                ValidationPipeError.create(error.property, value),
            );
          },
        );
        throw new BadRequestException(errorsForResponse);
      },
    }),
  );
}
