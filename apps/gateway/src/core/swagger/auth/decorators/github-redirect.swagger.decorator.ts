import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AuthSwagger } from '../auth.enum';

export function GithubAuthRedirectSwagger() {
  return applyDecorators(
    ApiOperation({ summary: AuthSwagger.githubRedirect }),
    ApiOkResponse({
      description: AuthSwagger.githubRedirectOk,
    }),
  );
}
