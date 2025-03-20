import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AuthSwagger } from '../auth.enum';

export function GoogleAuthRedirectSwagger() {
  return applyDecorators(
    ApiOperation({ summary: AuthSwagger.googleRedirect }),
    ApiOkResponse({
      description: AuthSwagger.googleRedirectOk,
    }),
  );
}
