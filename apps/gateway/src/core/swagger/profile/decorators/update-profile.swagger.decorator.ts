import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProfileEnum } from '../profile.enum';
import { BAD_REQUEST, UNAUTHORIZED } from '../../swagger.constants';
import { BadRequestResponse } from '../../../../../../common/views/response.view';

export function UpdateProfileSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: ProfileEnum.updateProfile,
    }),
    ApiBearerAuth(),
    ApiNoContentResponse({
      description: ProfileEnum.updateProfileOk,
    }),
    ApiUnauthorizedResponse({
      description: UNAUTHORIZED,
    }),
    ApiBadRequestResponse({
      description: BAD_REQUEST,
      type: BadRequestResponse,
    }),
  );
}
