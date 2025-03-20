import { applyDecorators } from '@nestjs/common';
import { AuthSwagger } from '../auth.enum';
import { NewPassDto } from '../../../../features/users/auth/api/dtos/auth/new-pass.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiOperation,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { BAD_REQUEST } from '../../swagger.constants';
import { BadRequestResponse } from '../../../../../../common/views/response.view';

export function NewPasswordSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: AuthSwagger.newPass,
    }),
    ApiBody({
      type: NewPassDto,
    }),
    ApiNoContentResponse({
      description: AuthSwagger.newPassOk,
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
