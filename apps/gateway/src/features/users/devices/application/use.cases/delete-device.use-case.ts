import { DevicesRepo } from '../../repos/device.repo';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeviceMessages } from '../../../../../core/constants/message.constants';
import { Result } from '../../../../../core/results/result';
import {
  ForbiddenError,
  NotFoundError,
} from '../../../../../../../common/exeptions/custom.exeption';

export class DeleteDeviceCommand {
  constructor(
    public deviceId: string,
    public userId: number,
  ) {}
}

@CommandHandler(DeleteDeviceCommand)
export class DeleteDeviceUseCase
  implements ICommandHandler<DeleteDeviceCommand>
{
  constructor(private readonly devicesRepository: DevicesRepo) {}

  async execute({ userId, deviceId }: DeleteDeviceCommand): Promise<Result> {
    const device = await this.devicesRepository.findById(deviceId);
    if (!device) return Result.Err(new NotFoundError(DeviceMessages.NOT_EXIST));

    if (device.userId !== userId)
      return Result.Err(new ForbiddenError(DeviceMessages.FORBIDDEN));
    await this.devicesRepository.deleteById(deviceId);
    return Result.Ok();
  }
}
