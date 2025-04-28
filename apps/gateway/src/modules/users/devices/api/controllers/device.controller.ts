import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { DeleteDeviceCommand } from '../../application/use.cases/delete-device.use-case';
import { CommandBus } from '@nestjs/cqrs';
import { RefreshTokenGuard } from '../../../auth/api/guards/refresh.guard';
import { CurrentUserIdAndDeviceId } from '../../../../../../../common/decorators/user-id-device-id.decorator';
import { DeviceQueryRepo } from '../../repos/device.query.repo';
import { DeleteAllDevicesExceptThisCommand } from '../../application/use.cases/delete-devices-except-this.use-case';
import { RefreshPayloadType } from '../../../../../common/adapters/jwt/jwt.adapter';
import { ApiResponseFactory } from '../../../../../common/swagger/api-responses/api-response.factory';
import { DevicesEnum } from '../../../../../common/swagger/enums/devices.enum';
import { OK } from '../../../../../common/swagger/swagger.constants';
import { DeviceListView } from '../../../../../common/views/device-list.view';

@ApiTags('Devices')
@ApiCookieAuth()
@Controller('security')
export class DevicesController {
  constructor(
    private readonly devicesQueryRepository: DeviceQueryRepo,
    private commandBus: CommandBus,
  ) {}

  @Get('devices')
  @ApiResponseFactory(DevicesEnum.myDevices, {
    200: { message: OK, body: DeviceListView },
    401: null,
    cookie: true,
  })
  @UseGuards(RefreshTokenGuard)
  async getAllDevicesByUserId(
    @CurrentUserIdAndDeviceId() { userId, deviceId }: RefreshPayloadType,
  ): Promise<DeviceListView> {
    return this.devicesQueryRepository.getByUserId(userId, deviceId);
  }

  @Delete('devices')
  @ApiResponseFactory(DevicesEnum.deleteAllDevicesExceptThis, {
    204: null,
    401: null,
    cookie: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenGuard)
  async deleteAllDevicesByIdExceptThis(
    @CurrentUserIdAndDeviceId() { userId, deviceId }: RefreshPayloadType,
  ): Promise<void> {
    await this.commandBus.execute<DeleteAllDevicesExceptThisCommand>(
      new DeleteAllDevicesExceptThisCommand(userId, deviceId),
    );
    return;
  }

  @Delete('devices/:deviceId')
  @ApiResponseFactory(DevicesEnum.deleteOneDevice, {
    204: null,
    401: null,
    403: null,
    404: null,
    cookie: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenGuard)
  async deleteDeviceById(
    @CurrentUserIdAndDeviceId() { userId }: RefreshPayloadType,
    @Param('deviceId') deviceId: string,
  ): Promise<void> {
    const result = await this.commandBus.execute<DeleteDeviceCommand>(
      new DeleteDeviceCommand(deviceId, userId),
    );
    if (!result.isSuccess) throw result.err;
    return;
  }
}
