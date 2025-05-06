import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Not, Repository } from 'typeorm';
import { Device } from '../../domain/device.entity';
import { RepositoryNotFoundError } from '../../../../common/errors/repository-not-found.error';

@Injectable()
export class DevicesRepo {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  async save(device: Device): Promise<Device> {
    return this.deviceRepository.save(device);
  }

  async findByIdOrFail(id: string): Promise<Device> {
    const result = await this.deviceRepository.findOne({
      where: {
        id,
      },
    });

    if (!result) {
      throw new RepositoryNotFoundError(`Device with id ${id} not found`);
    }

    return result;
  }

  async deleteById(id: string): Promise<void> {
    await this.deviceRepository.delete({
      id,
    });
    return;
  }

  async deleteAllDevicesByIdExceptThis(
    userId: number,
    deviceId: string,
  ): Promise<void> {
    await this.deviceRepository.delete({
      id: Not(deviceId),
      userId,
    });
    return;
  }

  async deleteAllDevicesByUserId(userId: number): Promise<void> {
    await this.deviceRepository.delete({
      userId,
    });
    return;
  }

  async deleteExpDevices(expValue: number): Promise<{ count: number }> {
    const res = await this.deviceRepository.delete({
      exp: LessThan(expValue),
    });

    return { count: res.affected };
  }
}
