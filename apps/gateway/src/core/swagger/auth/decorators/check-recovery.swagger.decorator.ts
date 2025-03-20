import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthSwagger } from '../auth.enum';
import { BAD_REQUEST } from '../../swagger.constants';

import { RecoveryDto } from '../../../../features/users/auth/api/dtos/auth/recovery.dto';
import { BadRequestResponse } from '../../../../../../common/views/response.view';

export function CheckRecoverySwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: AuthSwagger.checkRecovery,
    }),
    ApiBody({
      type: RecoveryDto,
    }),
    ApiOkResponse({
      description: AuthSwagger.checkRecoveryOk,
    }),
    ApiBadRequestResponse({
      description: BAD_REQUEST,
      type: BadRequestResponse,
    }),
    // ApiTooManyRequestsResponse({
    //   description: SwaggerConstants.throttler,
    // }),
  );
}
