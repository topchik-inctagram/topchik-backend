import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ApiError } from '../errors/api.error';
import { ErrorTag } from '../errors/error.tag';

export function pipesSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const validationErrors = errors.reduce(
          (acc, error) => {
            if (error.constraints) {
              // Берем первое сообщение об ошибке для каждого поля
              const [firstError] = Object.values(error.constraints);
              acc[error.property] = firstError;
            }
            return acc;
          },
          {} as Record<string, string>,
        );

        throw new ApiError({
          message: `'Validation failed. Please check your input and try again`,
          tag: ErrorTag.VALIDATION_FAILED,
          metadata: validationErrors,
        });
      },
    }),
  );
}
