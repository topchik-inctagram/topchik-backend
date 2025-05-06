import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepo } from '../../../repos/user.repo';
import { HashAdapter } from '../../../../../common/adapters/hash/hash.adapter';
import { Result } from '../../../../../core/results/result';
import { ConfirmationStatus } from '../../../domain/confirmation.entity';
import { DomainError } from '../../../../../common/errors/domain.error';
import { ErrorTag } from '../../../../../common/errors/error.tag';
import { UserDomainMessages } from '../../../domain/usser-domain.message';

export class CheckCredentialsCommand {
  constructor(
    public email: string,
    public password: string,
  ) {}
}

@CommandHandler(CheckCredentialsCommand)
export class CheckCredentialsUseCase
  implements ICommandHandler<CheckCredentialsCommand>
{
  constructor(
    private readonly userRepo: UserRepo,
    private readonly hashAdapter: HashAdapter,
  ) {}

  async execute({
    email,
    password,
  }: CheckCredentialsCommand): Promise<Result<{ userId: number }>> {
    const user = await this.userRepo.findByEmailOrFail(email);

    //check user password
    const isMatched = await this.hashAdapter.checkPassword(password, user.hash);
    if (!isMatched)
      throw new DomainError({
        tag: ErrorTag.VALIDATION_FAILED,
        message: UserDomainMessages.INCORRECT_PASS,
        metadata: {
          password: UserDomainMessages.INCORRECT_PASS,
        },
      });

    // check is user banned or not
    if (user.confirmation.status !== ConfirmationStatus.CONFIRM)
      throw new DomainError({
        tag: ErrorTag.NOT_FOUND,
        message: UserDomainMessages.NOT_CONFIRM,
      });

    return Result.Ok({
      userId: user.id,
    });
  }
}
