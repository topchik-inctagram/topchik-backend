import { UserRepo } from '../../../repos/user.repo';
import { Result } from '../../../../../core/results/result';
import { User } from '../../../domain/user.entity';
import { DomainError } from '../../../../../common/errors/domain.error';
import { ErrorTag } from '../../../../../common/errors/error.tag';
import { UserDomainMessages } from '../../../domain/usser-domain.message';

export abstract class BaseCheckRecoveryUseCase {
  protected constructor(protected readonly userRepo: UserRepo) {}

  async checkRecovery(recoveryCode: string): Promise<Result<User>> {
    const user = await this.userRepo.findByCodeRecoveryOrFail(recoveryCode);

    //check is recovery code expired
    if (user.recovery && user.recovery.exp < new Date()) {
      throw new DomainError({
        tag: ErrorTag.VALIDATION_FAILED,
        message: UserDomainMessages.EXPIRED_CODE,
        metadata: {
          recoveryCode: UserDomainMessages.EXPIRED_CODE,
        },
      });
    }

    return Result.Ok(user);
  }
}
