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
import { RefreshTokenGuard } from '../../../auth/guards/refresh.guard';
import { CurrentUserIdAndDeviceId } from '../../../../../../../common/decorators/user-id-device-id.decorator';
import { DeviceQueryRepo } from '../query.repos/device.query.repo';
import { DeleteAllDevicesExceptThisCommand } from '../../application/use.cases/delete-devices-except-this.use-case';
import { MyDevicesSwaggerDecorator } from '../../../../../core/swagger/devices/my-devices.swagger.decorator';
import { DeleteDeviceSwaggerDecorator } from '../../../../../core/swagger/devices/delete-device.swagger.decorator';
import { DeleteAllExceptThisSwaggerDecorator } from '../../../../../core/swagger/devices/delete-all-exept-this.swagger.decorator';
import { DeviceViewModel } from '../../../../../common/views/device.view';
import { PayloadType } from '../../../../../common/adapters/jwt/jwt.adapter';

@ApiTags('Devices')
@ApiCookieAuth()
@Controller('security')
export class DevicesController {
  constructor(
    private readonly devicesQueryRepository: DeviceQueryRepo,
    private commandBus: CommandBus,
  ) {}

  @Get('devices')
  @MyDevicesSwaggerDecorator()
  @UseGuards(RefreshTokenGuard)
  async getAllDevicesByUserId(
    @CurrentUserIdAndDeviceId() { userId, deviceId }: PayloadType,
  ): Promise<DeviceViewModel[]> {
    return this.devicesQueryRepository.getByUserId(userId, deviceId);
  }

  @Delete('devices')
  @DeleteAllExceptThisSwaggerDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenGuard)
  async deleteAllDevicesByIdExceptThis(
    @CurrentUserIdAndDeviceId() { userId, deviceId }: PayloadType,
  ): Promise<void> {
    await this.commandBus.execute<DeleteAllDevicesExceptThisCommand>(
      new DeleteAllDevicesExceptThisCommand(userId, deviceId),
    );
    return;
  }

  @Delete('devices/:deviceId')
  @DeleteDeviceSwaggerDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenGuard)
  async deleteDeviceById(
    @CurrentUserIdAndDeviceId() { userId }: PayloadType,
    @Param('deviceId') deviceId: string,
  ): Promise<void> {
    const result = await this.commandBus.execute<DeleteDeviceCommand>(
      new DeleteDeviceCommand(deviceId, userId),
    );
    if (!result.isSuccess) throw result.err;
    return;
  }
}
