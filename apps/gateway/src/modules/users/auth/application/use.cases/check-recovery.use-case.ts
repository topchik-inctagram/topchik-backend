import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepo } from '../../../repos/user.repo';
import { Result } from '../../../../../core/results/result';
import { BaseCheckRecoveryUseCase } from './base-check-recovery.use-case';
import { User } from '../../../domain/user.entity';

export class CheckRecoveryCommand {
  constructor(public recoveryCode: string) {}
}

@CommandHandler(CheckRecoveryCommand)
export class CheckRecoveryUseCase
  extends BaseCheckRecoveryUseCase
  implements ICommandHandler<CheckRecoveryCommand>
{
  constructor(protected readonly userRepo: UserRepo) {
    super(userRepo);
  }

  async execute({ recoveryCode }: CheckRecoveryCommand): Promise<Result<User>> {
    const result = await this.checkRecovery(recoveryCode);

    if (result.isSuccess) {
      return Result.Ok();
    }

    return result;
  }
}
