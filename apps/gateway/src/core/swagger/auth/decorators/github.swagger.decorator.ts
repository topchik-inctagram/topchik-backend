import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AuthSwagger } from '../auth.enum';

export function GithubAuthSwagger() {
  return applyDecorators(
    ApiOperation({ summary: AuthSwagger.github }),
    ApiOkResponse({
      description: AuthSwagger.githubOk,
    }),
  );
}
