import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { AuthSwagger } from '../auth.enum';

export function GoogleAuthSwagger() {
  return applyDecorators(
    ApiOperation({ summary: AuthSwagger.google }),
    ApiOkResponse({
      description: AuthSwagger.googleOk,
    }),
  );
}
