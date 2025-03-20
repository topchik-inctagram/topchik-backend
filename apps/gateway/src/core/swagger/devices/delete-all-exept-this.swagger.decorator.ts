import {
  ApiNoContentResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { NO_CONTENT, UNAUTHORIZED } from '../swagger.constants';
import { DevicesEnum } from './devices.enum';

export function DeleteAllExceptThisSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: DevicesEnum.deleteAllDevicesExceptThis,
    }),
    ApiNoContentResponse({
      description: NO_CONTENT,
    }),
    ApiUnauthorizedResponse({
      description: UNAUTHORIZED,
    }),
  );
}
