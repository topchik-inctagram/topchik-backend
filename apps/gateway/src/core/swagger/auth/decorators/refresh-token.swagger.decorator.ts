import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { AuthSwagger } from '../auth.enum';
import { UNAUTHORIZED } from '../../swagger.constants';
import { ResponseAccessTokenDto } from '../../../../features/users/auth/api/controllers/auth.controller';

export function RefreshTokenSwaggerDecorator() {
  return applyDecorators(
    ApiCookieAuth(),
    ApiOperation({
      summary: AuthSwagger.rT,
    }),
    ApiOkResponse({
      description: AuthSwagger.jwtOk,
      type: ResponseAccessTokenDto,
    }),
    ApiUnauthorizedResponse({
      description: UNAUTHORIZED,
    }),
  );
}
