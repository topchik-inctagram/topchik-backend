import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from '../../domain/device.entity';
import { Repository } from 'typeorm';
import { DeviceListView } from '../../../../common/views/device-list.view';

@Injectable()
export class DeviceQueryRepo {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  async getByUserId(
    userId: number,
    currentDeviceId: string,
  ): Promise<DeviceListView> {
    const devices = await this.deviceRepository.find({
      where: { userId },
    });

    return DeviceListView.builder(
      devices.map(
        (device) =>
          ({ ...device, current: device.id === currentDeviceId }) as Device & {
            current: boolean;
          },
      ),
    );
  }
}
