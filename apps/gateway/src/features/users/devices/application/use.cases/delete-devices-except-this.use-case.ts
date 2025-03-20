import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepo } from '../../repos/device.repo';
import { Result } from '../../../../../core/results/result';

export class DeleteAllDevicesExceptThisCommand {
  constructor(
    public userId: number,
    public deviceId: string,
  ) {}
}

@CommandHandler(DeleteAllDevicesExceptThisCommand)
export class DeleteAllDevicesExceptThisUseCase
  implements ICommandHandler<DeleteAllDevicesExceptThisCommand>
{
  constructor(private readonly devicesRepository: DevicesRepo) {}

  async execute(command: DeleteAllDevicesExceptThisCommand): Promise<Result> {
    await this.devicesRepository.deleteAllDevicesByIdExceptThis(
      command.userId,
      command.deviceId,
    );
    return Result.Ok();
  }
}
