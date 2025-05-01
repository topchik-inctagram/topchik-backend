import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepo } from '../../../repos/user.repo';
import { HashAdapter } from '../../../../../common/adapters/hash/hash.adapter';
import { Result } from '../../../../../core/results/result';

import { UserMessages } from '../../../../../common/constants/message.constants';
import {
  BadRequestError,
  NotFoundError,
} from '../../../../../../../common/exeptions/custom.exeption';
import { ConfirmationStatus } from '../../../domain/confirmation.entity';

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
    const user = await this.userRepo.findByEmail(email);

    if (!user) return Result.Err(new NotFoundError(UserMessages.NOT_EXIST));

    //check user password
    const isMatched = await this.hashAdapter.checkPassword(password, user.hash);
    if (!isMatched)
      return Result.Err(
        new BadRequestError(UserMessages.INCORRECT_EMAIL_OR_PASS, 'password'),
      );
    // check is user banned or not

    if (user.confirmation.status !== ConfirmationStatus.CONFIRM)
      return Result.Err(new NotFoundError(UserMessages.NOT_CONFIRM));

    return Result.Ok({
      userId: user.id,
    });
  }
}
