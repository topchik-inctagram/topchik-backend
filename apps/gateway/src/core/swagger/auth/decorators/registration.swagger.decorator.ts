import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiOperation,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { AuthSwagger } from '../auth.enum';
import { RegistrationInputDto } from '../../../../features/users/auth/api/dtos/auth/registration.dto';
import { BAD_REQUEST } from '../../swagger.constants';
import { BadRequestResponse } from '../../../../../../common/views/response.view';

export function RegistrationSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: AuthSwagger.registration,
    }),
    ApiBody({
      type: RegistrationInputDto,
    }),
    ApiNoContentResponse({
      description: AuthSwagger.registrationOk,
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
