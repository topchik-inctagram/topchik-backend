import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepo } from '../../../repos/user.repo';
import { HashAdapter } from '../../../../../common/adapters/hash/hash.adapter';
import { Result } from '../../../../../core/results/result';
import { DevicesRepo } from '../../../devices/repos/device.repo';
import { BaseCheckRecoveryUseCase } from './base-check-recovery.use-case';
import { User } from '../../../domain/user.entity';
import { DomainError } from '../../../../../../../common/errors/domain.error';
import { ErrorTag } from '../../../../../../../common/errors/error.tag';
import { UserDomainMessages } from '../../../domain/usser-domain.message';

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

    const user = result.value;

    //check user new password
    const isMatched = await this.hashAdapter.checkPassword(
      newPassword,
      user.hash,
    );

    if (isMatched)
      throw new DomainError({
        tag: ErrorTag.VALIDATION_FAILED,
        message: UserDomainMessages.NOT_NEW_PASS,
        metadata: {
          password: UserDomainMessages.NOT_NEW_PASS,
        },
      });

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
