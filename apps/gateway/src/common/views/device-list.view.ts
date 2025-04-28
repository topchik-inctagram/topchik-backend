import { ApiProperty } from '@nestjs/swagger';
import { DeviceView } from './device.view';
import { Device } from '../../modules/users/domain/device.entity';

export class DeviceListView {
  @ApiProperty({ isArray: true, type: DeviceView })
  devices: DeviceView[];

  static builder(devices: (Device & { current: boolean })[]): DeviceListView {
    const instance = new this();
    instance.devices = devices.map((device) => DeviceView.builder(device));

    return instance;
  }
}
