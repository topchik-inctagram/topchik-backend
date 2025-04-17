import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ProfileEnum } from '../profile.enum';
import { CountView } from '../../../../common/views/count.view';
import { SUCCESS } from '../../../constants/message.constants';

export function UserCountSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: ProfileEnum.userCount,
    }),
    ApiOkResponse({
      description: SUCCESS,
      type: CountView,
    }),
  );
}
