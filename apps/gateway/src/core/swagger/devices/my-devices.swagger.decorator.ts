import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { DevicesEnum } from './devices.enum';
import { OK, UNAUTHORIZED } from '../swagger.constants';
import { DeviceViewModel } from '../../views/device.view';

export function MyDevicesSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: DevicesEnum.myDevices,
    }),
    ApiOkResponse({
      description: OK,
      isArray: true,
      type: DeviceViewModel,
    }),
    ApiUnauthorizedResponse({
      description: UNAUTHORIZED,
    }),
  );
}
