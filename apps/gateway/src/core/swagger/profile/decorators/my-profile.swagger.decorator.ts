import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProfileEnum } from '../profile.enum';
import { UserView } from '../../../views/user.view';
import { NOT_FOUND, UNAUTHORIZED } from '../../swagger.constants';

export function MyProfileSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: ProfileEnum.myProfile,
    }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: ProfileEnum.myProfileOk,
      type: UserView,
    }),
    ApiNotFoundResponse({
      description: NOT_FOUND,
    }),
    ApiUnauthorizedResponse({
      description: UNAUTHORIZED,
    }),
  );
}
