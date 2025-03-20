import { AuthSwagger } from '../auth.enum';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { LoginInputDto } from '../../../../features/users/auth/api/dtos/auth/login.dto';
import { ResponseAccessTokenDto } from '../../../../features/users/auth/api/controllers/auth.controller';
import { BAD_REQUEST, UNAUTHORIZED } from '../../swagger.constants';
import { BadRequestResponse } from '../../../../../../common/views/response.view';

export function LoginSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: AuthSwagger.login,
    }),
    ApiBody({
      type: LoginInputDto,
    }),
    ApiOkResponse({
      description: AuthSwagger.jwtOk,
      type: ResponseAccessTokenDto,
    }),
    ApiBadRequestResponse({
      description: BAD_REQUEST,
      type: BadRequestResponse,
    }),
    ApiUnauthorizedResponse({
      description: UNAUTHORIZED,
    }),
    // ApiTooManyRequestsResponse({
    //   description: SwaggerConstants.throttler,
    // }),
  );
}
