import { UserRepo } from '../../../repos/user.repo';
import { Result } from '../../../../../core/results/result';

import { UserMessages } from '../../../../../common/constants/message.constants';
import { BadRequestError } from '../../../../../../../common/exeptions/custom.exeption';
import { User } from '../../../domain/user.entity';

export abstract class BaseCheckRecoveryUseCase {
  protected constructor(protected readonly userRepo: UserRepo) {}

  async checkRecovery(recoveryCode: string): Promise<Result<User>> {
    const user = await this.userRepo.findByCodeRecovery(recoveryCode);

    if (!user) {
      return Result.Err(
        new BadRequestError(UserMessages.EXPIRED_CODE, 'recoveryCode'),
      );
    }

    //check is recovery code expired
    if (user.recovery && user.recovery.exp < new Date()) {
      return Result.Err(
        new BadRequestError(UserMessages.EXPIRED_CODE, 'recoveryCode'),
      );
    }

    return Result.Ok(user);
  }
}
