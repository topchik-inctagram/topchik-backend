import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserRepo } from '../../../repos/user.repo';
import { Result } from '../../../../../core/results/result';
import { UserMessages } from '../../../../../common/constants/message.constants';
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
    private readonly userRepo: UserRepo,
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

    user.confirmation.update();

    await this.userRepo.save(user);
    this.createUserEvent(user.nickname, user.confirmation.code, user.email);
    return Result.Ok();
  }

  private createUserEvent(nickname: string, code: string, email: string) {
    const event = new CreateUserEvent(nickname, code, email);

    this.eventBus.publish(event);
  }
}
