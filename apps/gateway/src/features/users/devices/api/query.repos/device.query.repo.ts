import { DbService } from '../../../../global/application/db/db.service';
import { Injectable } from '@nestjs/common';
import { DeviceViewModel } from '../../../../../common/views/device.view';

@Injectable()
export class DeviceQueryRepo {
  constructor(private dbService: DbService) {}

  async getByUserId(userId: number, currentDeviceId: string) {
    const devices = await this.dbService.device.findMany({
      where: { userId },
    });

    return devices.map((d) => new DeviceViewModel(d, d.id === currentDeviceId));
  }
}
