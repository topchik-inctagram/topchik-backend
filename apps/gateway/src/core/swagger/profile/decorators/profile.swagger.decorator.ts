import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { NOT_FOUND } from '../../swagger.constants';
import { UserView } from '../../../views/user.view';
import { ProfileEnum } from '../profile.enum';

export function ProfileSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: ProfileEnum.profile,
    }),
    ApiOkResponse({
      description: ProfileEnum.profileOk,
      type: UserView,
    }),
    ApiNotFoundResponse({
      description: NOT_FOUND,
    }),
  );
}
