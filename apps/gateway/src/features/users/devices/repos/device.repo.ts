import { Injectable } from '@nestjs/common';
import { DbService } from '../../../global/application/db/db.service';

export type DeviceType = {
  id: string;
  title: string;
  ip: string;
  exp: number;
  iat: number;
  userId: number;
};

@Injectable()
export class DevicesRepo {
  constructor(private dbService: DbService) {}

  async create(device: DeviceType) {
    return this.dbService.device.create({
      data: device,
    });
  }

  async findById(id: string) {
    return this.dbService.device.findUnique({
      where: {
        id,
      },
    });
  }

  async deleteById(id: string) {
    return this.dbService.device.delete({
      where: {
        id,
      },
    });
  }

  async update(data: DeviceType) {
    return this.dbService.device.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async deleteAllDevicesByIdExceptThis(userId: number, deviceId: string) {
    return this.dbService.device.deleteMany({
      where: {
        id: { not: deviceId },
        userId,
      },
    });
  }

  async deleteAllDevicesByUserId(userId: number) {
    return this.dbService.device.deleteMany({
      where: {
        userId,
      },
    });
  }

  async deleteExpDevices(exp: number) {
    return this.dbService.device.deleteMany({
      where: {
        exp: {
          lt: exp,
        },
      },
    });
  }
}
