import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepo } from '../../../repos/user.repo';
import { Result } from '../../../../../core/results/result';
import { DomainError } from '../../../../../../../common/errors/domain.error';
import { ErrorTag } from '../../../../../../../common/errors/error.tag';
import { UserDomainMessages } from '../../../domain/usser-domain.message';

export class ConfirmEmailCommand {
  constructor(public code: string) {}
}

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailUseCase
  implements ICommandHandler<ConfirmEmailCommand>
{
  constructor(private readonly userRepo: UserRepo) {}

  async execute({ code }: ConfirmEmailCommand): Promise<Result<boolean>> {
    const user = await this.userRepo.findByCodeConfirmationOrFail(code);

    if (user.confirmation && user.confirmation.exp < new Date()) {
      throw new DomainError({
        tag: ErrorTag.VALIDATION_FAILED,
        message: UserDomainMessages.EXPIRED_CODE,
        metadata: {
          code: UserDomainMessages.EXPIRED_CODE,
        },
      });
    }

    if (user && user.confirmation.status === 'CONFIRM') {
      return Result.Ok();
    }

    user.confirmation.confirm();

    await this.userRepo.save(user);

    return Result.Ok();
  }
}
