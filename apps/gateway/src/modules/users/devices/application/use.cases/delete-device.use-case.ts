import { DevicesRepo } from '../../repos/device.repo';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from '../../../../../core/results/result';
import { DomainError } from '../../../../../../../common/errors/domain.error';
import { ErrorTag } from '../../../../../../../common/errors/error.tag';
import { DeviceDomainMessages } from '../device-domain.message';

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
    const device = await this.devicesRepository.findByIdOrFail(deviceId);

    if (device.userId !== userId) {
      throw new DomainError({
        tag: ErrorTag.PERMISSION_DENIED,
        message: DeviceDomainMessages.PERMISSION_DENIED,
      });
    }

    await this.devicesRepository.deleteById(deviceId);
    return Result.Ok();
  }
}
