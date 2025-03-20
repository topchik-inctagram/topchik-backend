import { AuthSwagger } from '../auth.enum';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiOperation,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { BAD_REQUEST } from '../../swagger.constants';

import { InputEmailDto } from '../../../../features/users/auth/api/dtos/auth/input-email.dto';
import { BadRequestResponse } from '../../../../../../common/views/response.view';

export function RegistrationEmailResendingSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: AuthSwagger.resending,
    }),
    ApiBody({
      type: InputEmailDto,
    }),
    ApiNoContentResponse({
      description: AuthSwagger.resendingOk,
    }),
    ApiBadRequestResponse({
      description: BAD_REQUEST,
      type: BadRequestResponse,
    }),
    ApiTooManyRequestsResponse({
      description: AuthSwagger.throttler,
    }),
  );
}
