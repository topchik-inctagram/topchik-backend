import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUserRepo, UserRepo } from '../../repos/user.repo';
import { HashAdapter } from '../../../../../core/adapters/hash/hash.adapter';
import { Result } from '../../../../../core/results/result';
import { RecoveryType } from './pass-recovery.use-case';
import { DevicesRepo } from '../../../devices/repos/device.repo';
import { BaseCheckRecoveryUseCase } from './base-check-recovery.use-case';
import { UserEntity } from '../../../../global/application/db/domain/user.entity';
import { BadRequestError } from '../../../../../../../common/exeptions/custom.exeption';
import { UserMessages } from '../../../../../core/constants/message.constants';

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
    @Inject(UserRepo) protected readonly userRepo: IUserRepo,
    private readonly hashAdapter: HashAdapter,
    private readonly deviceRepo: DevicesRepo,
  ) {
    super(userRepo);
  }

  async execute({
    newPassword,
    recoveryCode,
  }: ChangePasswordCommand): Promise<Result> {
    const result = await this.checkRecovery(recoveryCode);

    if (!result.isSuccess) {
      return result;
    }

    const user = result.value as UserEntity;

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

    //todo
    const recovery = {
      code: null,
      exp: null,
      status: 'DONE',
    } as RecoveryType;

    await this.userRepo.updateHash(user.id, passwordHash);
    await this.userRepo.updateRecovery(user.id, recovery);
    await this.deviceRepo.deleteAllDevicesByUserId(user.id);
    return Result.Ok();
  }
}
