import { Inject } from '@nestjs/common';
import { IUserRepo, UserRepo } from '../../repos/user.repo';
import { Result } from '../../../../../core/results/result';

import { UserMessages } from '../../../../../core/constants/message.constants';
import { BadRequestError } from '../../../../../../../common/exeptions/custom.exeption';

export abstract class BaseCheckRecoveryUseCase {
  protected constructor(
    @Inject(UserRepo) protected readonly userRepo: IUserRepo,
  ) {}

  async checkRecovery(recoveryCode: string): Promise<Result> {
    const user = await this.userRepo.findByCodeRecovery(recoveryCode);

    if (!user) {
      return Result.Err(
        new BadRequestError(UserMessages.EXPIRED_CODE, 'recoveryCode'),
      );
    }

    //check is recovery code expired
    if (user.recovery && user.recovery.exp < new Date())
      return Result.Err(
        new BadRequestError(UserMessages.EXPIRED_CODE, 'recoveryCode'),
      );

    return Result.Ok(user);
  }
}
