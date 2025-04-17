import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IUserRepo, UserRepo } from '../../repos/user.repo';
import { HashAdapter } from '../../../../../common/adapters/hash/hash.adapter';
import { Result } from '../../../../../core/results/result';

import { UserMessages } from '../../../../../core/constants/message.constants';
import {
  BadRequestError,
  NotFoundError,
} from '../../../../../../../common/exeptions/custom.exeption';

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
    @Inject(UserRepo) private readonly userRepo: IUserRepo,
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

    if (user.confirmation.status !== 'CONFIRM')
      return Result.Err(new NotFoundError(UserMessages.NOT_CONFIRM));

    return Result.Ok({
      userId: user.id,
    });
  }
}
