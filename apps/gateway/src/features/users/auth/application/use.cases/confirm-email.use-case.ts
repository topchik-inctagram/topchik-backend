import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUserRepo, UserRepo } from '../../repos/user.repo';
import { Result } from '../../../../../core/results/result';

import { UserMessages } from '../../../../../core/constants/message.constants';
import { BadRequestError } from '../../../../../../../common/exeptions/custom.exeption';

export class ConfirmEmailCommand {
  constructor(public code: string) {}
}

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailUseCase
  implements ICommandHandler<ConfirmEmailCommand>
{
  constructor(@Inject(UserRepo) private readonly userRepo: IUserRepo) {}

  async execute({ code }: ConfirmEmailCommand): Promise<Result<boolean>> {
    const userInfo = await this.userRepo.findByCodeConfirmation(code);

    if (!userInfo) {
      return Result.Err(new BadRequestError(UserMessages.NOT_EXIST, 'code'));
    }

    if (userInfo.confirmation && userInfo.confirmation.exp < new Date()) {
      return Result.Err(new BadRequestError(UserMessages.EXPIRED_CODE, 'code'));
    }

    if (userInfo && userInfo.confirmation.status === 'CONFIRM') {
      return Result.Ok(true);
    }

    userInfo.confirmation.status = 'CONFIRM';
    userInfo.confirmation.code = null;
    userInfo.confirmation.exp = null;
    await this.userRepo.updateConfirmation(userInfo.id, {
      code: userInfo.confirmation.code,
      exp: userInfo.confirmation.exp,
      status: 'CONFIRM',
    });

    return Result.Ok(true);
  }
}
