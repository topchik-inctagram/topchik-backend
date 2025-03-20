import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProfileEnum } from '../../profile/profile.enum';
import { UserView } from '../../../views/user.view';
import { UNAUTHORIZED } from '../../swagger.constants';

export function MeSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: ProfileEnum.myProfile,
    }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: ProfileEnum.myProfileOk,
      type: UserView,
    }),
    ApiUnauthorizedResponse({
      description: UNAUTHORIZED,
    }),
  );
}
