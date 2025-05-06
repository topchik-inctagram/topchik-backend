import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserRepo } from '../../../repos/user.repo';
import { Result } from '../../../../../core/results/result';
import { CreateUserEvent } from '../../events/create-user.event';
import { DomainError } from '../../../../../common/errors/domain.error';
import { ErrorTag } from '../../../../../common/errors/error.tag';
import { UserDomainMessages } from '../../../domain/usser-domain.message';

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
    const user = await this.userRepo.findByEmailOrFail(email);

    if (user.confirmation.status === 'CONFIRM') {
      throw new DomainError({
        tag: ErrorTag.VALIDATION_FAILED,
        message: UserDomainMessages.ALREADY_CONFIRM,
        metadata: {
          email: UserDomainMessages.ALREADY_CONFIRM,
        },
      });
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
