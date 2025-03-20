import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthSwagger } from '../auth.enum';
import { EmailView } from '../../../views/email.view';
import { BAD_REQUEST } from '../../swagger.constants';

import { InputEmailDto } from '../../../../features/users/auth/api/dtos/auth/input-email.dto';
import { BadRequestResponse } from '../../../../../../common/views/response.view';

export function PasswordRecoveryEmailResendingSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: AuthSwagger.passRecovery,
    }),
    ApiBody({
      type: InputEmailDto,
    }),
    ApiOkResponse({
      description: AuthSwagger.passRecoveryOk,
      type: EmailView,
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
