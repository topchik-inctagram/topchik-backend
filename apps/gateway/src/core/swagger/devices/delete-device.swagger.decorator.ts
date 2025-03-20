import {
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import {
  FORBIDDEN,
  NO_CONTENT,
  NOT_FOUND,
  UNAUTHORIZED,
} from '../swagger.constants';
import { DevicesEnum } from './devices.enum';

export function DeleteDeviceSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: DevicesEnum.deleteOneDevice,
    }),
    ApiNoContentResponse({
      description: NO_CONTENT,
    }),
    ApiUnauthorizedResponse({
      description: UNAUTHORIZED,
    }),
    ApiForbiddenResponse({
      description: FORBIDDEN,
    }),
    ApiNotFoundResponse({
      description: NOT_FOUND,
    }),
  );
}
