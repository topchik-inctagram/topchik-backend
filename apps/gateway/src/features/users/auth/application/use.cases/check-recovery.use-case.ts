import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IUserRepo, UserRepo } from '../../repos/user.repo';
import { Result } from '../../../../../core/results/result';
import { BaseCheckRecoveryUseCase } from './base-check-recovery.use-case';

export class CheckRecoveryCommand {
  constructor(public recoveryCode: string) {}
}

@CommandHandler(CheckRecoveryCommand)
export class CheckRecoveryUseCase
  extends BaseCheckRecoveryUseCase
  implements ICommandHandler<CheckRecoveryCommand>
{
  constructor(@Inject(UserRepo) protected readonly userRepo: IUserRepo) {
    super(userRepo);
  }

  async execute({ recoveryCode }: CheckRecoveryCommand): Promise<Result> {
    const result = await this.checkRecovery(recoveryCode);

    if (result.isSuccess) {
      return Result.Ok();
    }

    return result;
  }
}
