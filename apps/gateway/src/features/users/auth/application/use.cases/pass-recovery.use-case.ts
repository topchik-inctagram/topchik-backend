import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IUserRepo, UserRepo } from '../../repos/user.repo';
import { Result } from '../../../../../core/results/result';

import { UserMessages } from '../../../../../core/constants/message.constants';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { UpdateRecoveryEvent } from '../../events/update-recovery.event';
import { BadRequestError } from '../../../../../../../common/exeptions/custom.exeption';

export type RecoveryType = {
  code: string | null;
  exp: Date | null;
  status: 'DONE' | 'IN_PROGRESS';
};

export class PassRecoveryCommand {
  constructor(public email: string) {}
}

@CommandHandler(PassRecoveryCommand)
export class CreateRecoveryCodeUseCase
  implements ICommandHandler<PassRecoveryCommand>
{
  constructor(
    @Inject(UserRepo) private readonly userRepo: IUserRepo,
    private readonly eventBus: EventBus,
  ) {}

  async execute({ email }: PassRecoveryCommand): Promise<Result> {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      return Result.Err(
        new BadRequestError(UserMessages.NOT_EXIST_BY_EMAIL, 'email'),
      );
    }
    //todo
    user.recovery.code = randomUUID();
    user.recovery.exp = add(new Date(), {
      minutes: 5,
    });
    user.recovery.status = 'IN_PROGRESS';

    await this.userRepo.updateRecovery(user.id, {
      code: user.recovery.code,
      exp: user.recovery.exp,
      status: user.recovery.status,
    });

    this.updateRecoveryEvent(user.nickname, user.recovery.code, user.email);

    return Result.Ok();
  }

  private updateRecoveryEvent(nickname: string, code: string, email: string) {
    const event = new UpdateRecoveryEvent(nickname, code, email);

    this.eventBus.publish(event);
  }
}
