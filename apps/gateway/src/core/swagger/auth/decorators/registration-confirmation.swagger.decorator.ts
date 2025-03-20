import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiOperation,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { AuthSwagger } from '../auth.enum';
import { ConfirmEmailDto } from '../../../../features/users/auth/api/dtos/auth/confirm-email.dto';
import { BAD_REQUEST } from '../../swagger.constants';
import { BadRequestResponse } from '../../../../../../common/views/response.view';

export function RegistrationConfirmationSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: AuthSwagger.confirm,
    }),
    ApiBody({
      type: ConfirmEmailDto,
    }),
    ApiNoContentResponse({
      description: AuthSwagger.confirmOk,
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
