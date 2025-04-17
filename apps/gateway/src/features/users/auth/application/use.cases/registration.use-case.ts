import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { IUserRepo, UserRepo } from '../../repos/user.repo';
import { Inject } from '@nestjs/common';
import { RegistrationInputDto } from '../../api/dtos/auth/registration.dto';
import { HashAdapter } from '../../../../../common/adapters/hash/hash.adapter';
import { CreateUserEvent } from '../../events/create-user.event';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';

import { UserMessages } from '../../../../../core/constants/message.constants';
import { Result } from '../../../../../core/results/result';
import { RecoveryType } from './pass-recovery.use-case';
import { UserEntity } from '../../../../global/application/db/domain/user.entity';
import {
  BadRequestError,
  BadRequestErrors,
} from '../../../../../../../common/exeptions/custom.exeption';

export type UserType = {
  nickname: string;
  email: string;
  hash: string;
};

export type ConfirmationType = {
  code: string | null;
  exp: Date | null;
  status: 'CONFIRM' | 'NOT_CONFIRM';
};

export class RegistrationCommand {
  constructor(public userDto: RegistrationInputDto) {}
}

@CommandHandler(RegistrationCommand)
export class RegistrationUseCase
  implements ICommandHandler<RegistrationCommand>
{
  constructor(
    @Inject(UserRepo) private readonly userRepo: IUserRepo,
    private readonly hashAdapter: HashAdapter,
    private readonly eventBus: EventBus,
  ) {}

  async execute({
    userDto: { username, password, email },
  }: RegistrationCommand): Promise<Result> {
    const isUserExist: UserEntity = await this.userRepo.findByEmailOrNick({
      nickname: username,
      email,
    });

    if (!isUserExist) {
      return this.createUser(username, password, email);
    } else {
      return this.validateUser(isUserExist, username, password, email);
    }
  }

  private async createUser(
    nickname: string,
    password: string,
    email: string,
  ): Promise<Result> {
    const hash = await this.hashAdapter.generatePasswordHash(password);

    const user = UserEntity.create(nickname, email, hash);

    const createdUser = await this.userRepo.create(user);

    this.createUserEvent(nickname, createdUser.confirmation.code, email);

    return Result.Ok();
  }

  private async validateUser(
    user: UserEntity,
    nickname: string,
    password: string,
    email: string,
  ): Promise<Result> {
    //пользователь уже регистрировался через oAuth
    if (user.email === email && user.hash === 'no_pass') {
      const hash = await this.hashAdapter.generatePasswordHash(password);
      await this.userRepo.updateHash(user.id, hash);
      const confirmation = this.createConfirmation();
      await this.userRepo.updateConfirmation(user.id, confirmation);
      this.createUserEvent(nickname, confirmation.code, email);
      return Result.Ok();
    }

    if (user.nickname === nickname && user.email === email) {
      const checkPass = await this.hashAdapter.checkPassword(
        password,
        user.hash,
      );

      if (checkPass && user.confirmation.status === 'NOT_CONFIRM') {
        const confirmation = this.createConfirmation();
        await this.userRepo.updateConfirmation(user.id, confirmation);
        this.createUserEvent(nickname, confirmation.code, email);
        return Result.Ok();
      } else {
        return Result.Err(
          new BadRequestErrors([
            {
              field: 'username',
              message: UserMessages.ALREADY_REGISTERED_BY_USERNAME,
            },
            {
              field: 'email',
              message: UserMessages.ALREADY_REGISTERED_BY_EMAIL,
            },
          ]),
        );
      }
    }

    if (user.nickname === nickname) {
      return Result.Err(
        new BadRequestError(
          UserMessages.ALREADY_REGISTERED_BY_USERNAME,
          'username',
        ),
      );
    }
    if (user.email === email) {
      return Result.Err(
        new BadRequestError(UserMessages.ALREADY_REGISTERED_BY_EMAIL, 'email'),
      );
    }

    return Result.Err(
      new BadRequestErrors([
        {
          field: 'username',
          message: UserMessages.ALREADY_REGISTERED_BY_USERNAME,
        },
        {
          field: 'email',
          message: UserMessages.ALREADY_REGISTERED_BY_EMAIL,
        },
      ]),
    );
  }

  //todo
  private createConfirmation(): ConfirmationType {
    return {
      code: randomUUID(),
      exp: add(new Date(), {
        minutes: 5,
      }),
      status: 'NOT_CONFIRM',
    };
  }

  private createRecovery(): RecoveryType {
    return {
      code: null,
      exp: null,
      status: 'DONE',
    };
  }

  private createUserEvent(nickname: string, code: string, email: string) {
    const event = new CreateUserEvent(nickname, code, email);

    this.eventBus.publish(event);
  }
}
