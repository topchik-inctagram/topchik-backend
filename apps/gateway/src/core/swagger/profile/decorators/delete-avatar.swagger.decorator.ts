import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProfileEnum } from '../profile.enum';
import { UNAUTHORIZED } from '../../swagger.constants';
import { BadRequestResponse } from '../../../../../../common/views/response.view';

export function DeleteAvatarSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: ProfileEnum.deleteAvatar,
    }),
    ApiBearerAuth(),
    ApiNoContentResponse({
      description: ProfileEnum.deleteAvatarOk,
    }),
    ApiUnauthorizedResponse({
      description: UNAUTHORIZED,
    }),
    ApiBadRequestResponse({
      description: ProfileEnum.deleteAvatar_400,
      type: BadRequestResponse,
    }),
  );
}
