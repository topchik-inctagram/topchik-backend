import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserRepo } from '../../../repos/user.repo';
import { Result } from '../../../../../core/results/result';
import { UpdateRecoveryEvent } from '../../events/update-recovery.event';
import { Recovery } from '../../../domain/recovery.entity';

export class PassRecoveryCommand {
  constructor(public email: string) {}
}

@CommandHandler(PassRecoveryCommand)
export class CreateRecoveryCodeUseCase
  implements ICommandHandler<PassRecoveryCommand>
{
  constructor(
    private readonly userRepo: UserRepo,
    private readonly eventBus: EventBus,
  ) {}

  async execute({ email }: PassRecoveryCommand): Promise<Result> {
    const user = await this.userRepo.findByEmailOrFail(email);

    if (user.recovery) {
      user.recovery.update();
    } else {
      user.recovery = Recovery.create(user.id);
    }

    await this.userRepo.saveRecovery(user.recovery);

    this.updateRecoveryEvent(user.nickname, user.recovery.code, user.email);

    return Result.Ok();
  }

  private updateRecoveryEvent(nickname: string, code: string, email: string) {
    const event = new UpdateRecoveryEvent(nickname, code, email);

    this.eventBus.publish(event);
  }
}
