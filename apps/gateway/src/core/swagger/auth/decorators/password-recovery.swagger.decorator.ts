import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { AuthSwagger } from '../auth.enum';
import { BAD_REQUEST } from '../../swagger.constants';

import { PassRecoveryDto } from '../../../../features/users/auth/api/dtos/auth/pass-recovery.dto';
import { BadRequestResponse } from '../../../../../../common/views/response.view';

export function PasswordRecoverySwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: AuthSwagger.passRecovery,
    }),
    ApiBody({
      type: PassRecoveryDto,
    }),
    ApiNoContentResponse({
      description: AuthSwagger.passRecoveryOk,
    }),
    ApiBadRequestResponse({
      description: BAD_REQUEST,
      type: BadRequestResponse,
    }),
    ApiForbiddenResponse({
      description: 'Если проверка recaptcha провалилась',
    }),
    ApiTooManyRequestsResponse({
      description: AuthSwagger.throttler,
    }),
  );
}
