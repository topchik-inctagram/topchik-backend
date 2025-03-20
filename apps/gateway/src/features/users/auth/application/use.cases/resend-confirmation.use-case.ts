import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { IUserRepo, UserRepo } from '../../repos/user.repo';
import { Result } from '../../../../../core/results/result';
import { UserMessages } from '../../../../../core/constants/message.constants';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { CreateUserEvent } from '../../events/create-user.event';
import { BadRequestError } from '../../../../../../../common/exeptions/custom.exeption';

export class ResendConfirmationCommand {
  constructor(public email: string) {}
}

@CommandHandler(ResendConfirmationCommand)
export class CheckEmailIsConfirmedUseCase
  implements ICommandHandler<ResendConfirmationCommand>
{
  constructor(
    @Inject(UserRepo) private readonly userRepo: IUserRepo,
    private readonly eventBus: EventBus,
  ) {}

  async execute({ email }: ResendConfirmationCommand): Promise<Result> {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      return Result.Err(
        new BadRequestError(UserMessages.ALREADY_CONFIRM, 'email'),
      );
    }

    if (user.confirmation.status === 'CONFIRM') {
      return Result.Err(
        new BadRequestError(UserMessages.ALREADY_CONFIRM, 'email'),
      );
    }
    //todo
    user.confirmation.code = randomUUID();
    user.confirmation.exp = add(new Date(), {
      minutes: 5,
    });
    user.confirmation.status = 'NOT_CONFIRM';

    await this.userRepo.updateConfirmation(user.id, {
      code: user.confirmation.code,
      exp: user.confirmation.exp,
      status: user.confirmation.status,
    });
    this.createUserEvent(user.nickname, user.confirmation.code, user.email);
    return Result.Ok();
  }

  private createUserEvent(nickname: string, code: string, email: string) {
    const event = new CreateUserEvent(nickname, code, email);

    this.eventBus.publish(event);
  }
}
