import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepo } from '../../../repos/user.repo';
import { Result } from '../../../../../core/results/result';

import { UserMessages } from '../../../../../common/constants/message.constants';
import { BadRequestError } from '../../../../../../../common/exeptions/custom.exeption';

export class ConfirmEmailCommand {
  constructor(public code: string) {}
}

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailUseCase
  implements ICommandHandler<ConfirmEmailCommand>
{
  constructor(private readonly userRepo: UserRepo) {}

  async execute({ code }: ConfirmEmailCommand): Promise<Result<boolean>> {
    const user = await this.userRepo.findByCodeConfirmation(code);

    if (!user) {
      return Result.Err(new BadRequestError(UserMessages.NOT_EXIST, 'code'));
    }

    if (user.confirmation && user.confirmation.exp < new Date()) {
      return Result.Err(new BadRequestError(UserMessages.EXPIRED_CODE, 'code'));
    }

    if (user && user.confirmation.status === 'CONFIRM') {
      return Result.Ok(true);
    }

    user.confirmation.confirm();

    await this.userRepo.save(user);

    return Result.Ok(true);
  }
}
