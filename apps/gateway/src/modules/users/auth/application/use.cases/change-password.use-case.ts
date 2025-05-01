import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepo } from '../../../repos/user.repo';
import { HashAdapter } from '../../../../../common/adapters/hash/hash.adapter';
import { Result } from '../../../../../core/results/result';
import { DevicesRepo } from '../../../devices/repos/device.repo';
import { BaseCheckRecoveryUseCase } from './base-check-recovery.use-case';
import { BadRequestError } from '../../../../../../../common/exeptions/custom.exeption';
import { UserMessages } from '../../../../../common/constants/message.constants';
import { User } from '../../../domain/user.entity';

export class ChangePasswordCommand {
  constructor(
    public newPassword: string,
    public recoveryCode: string,
  ) {}
}

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordUseCase
  extends BaseCheckRecoveryUseCase
  implements ICommandHandler<ChangePasswordCommand>
{
  constructor(
    protected readonly userRepo: UserRepo,
    private readonly hashAdapter: HashAdapter,
    private readonly deviceRepo: DevicesRepo,
  ) {
    super(userRepo);
  }

  async execute({
    newPassword,
    recoveryCode,
  }: ChangePasswordCommand): Promise<Result<User>> {
    const result = await this.checkRecovery(recoveryCode);

    if (!result.isSuccess) {
      return result;
    }

    const user = result.value;

    //check user new password
    const isMatched = await this.hashAdapter.checkPassword(
      newPassword,
      user.hash,
    );

    if (isMatched)
      return Result.Err(
        new BadRequestError(UserMessages.NOT_NEW_PASS, 'password'),
      );

    //generate new password hash
    const passwordHash =
      await this.hashAdapter.generatePasswordHash(newPassword);

    user.update({ hash: passwordHash });
    user.recovery.confirm();

    await this.userRepo.save(user);

    await this.deviceRepo.deleteAllDevicesByUserId(user.id);
    return Result.Ok();
  }
}
