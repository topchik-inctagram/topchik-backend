import { DevicesRepo } from '../../repos/device.repo';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AppLoggerService } from '../../../../../../../common/logger/logger.service';

@Injectable()
export class DeleteExpDevicesUseCase {
  constructor(
    private readonly devicesRepository: DevicesRepo,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(DeleteExpDevicesUseCase.name);
  }

  @Cron('0 * * * *') // каждый час
  async execute() {
    try {
      const currentExp = Math.floor(Date.now() / 1000);

      this.logger.log(
        `Start delete exp devices in date ${new Date(currentExp * 1000).toISOString()}`,
      );

      const { count } =
        await this.devicesRepository.deleteExpDevices(currentExp);

      this.logger.log(
        `End delete exp devices. Count of deleted devices: ${count}`,
      );
    } catch (e) {
      this.logger.error(`Schedule error to delete exp devices. Error: ${e}`);
    }
  }
}
