import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserRepo } from '../../../repos/user.repo';
import { HashAdapter } from '../../../../../common/adapters/hash/hash.adapter';
import { CreateUserEvent } from '../../events/create-user.event';
import { Result } from '../../../../../core/results/result';
import { User } from '../../../domain/user.entity';
import { RegistrationInputDto } from '../../api/dtos/registration.dto';
import { DomainError } from '../../../../../common/errors/domain.error';
import { ErrorTag } from '../../../../../common/errors/error.tag';
import { UserDomainMessages } from '../../../domain/usser-domain.message';

export class RegistrationCommand {
  constructor(public userDto: RegistrationInputDto) {}
}

@CommandHandler(RegistrationCommand)
export class RegistrationUseCase
  implements ICommandHandler<RegistrationCommand>
{
  constructor(
    private readonly userRepo: UserRepo,
    private readonly hashAdapter: HashAdapter,
    private readonly eventBus: EventBus,
  ) {}

  async execute({
    userDto: { username, password, email },
  }: RegistrationCommand): Promise<Result> {
    const isUserExist = await this.userRepo.findByEmailOrNick({
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

    const user = User.create({ nickname, email, hash });

    await this.userRepo.save(user);

    this.createUserEvent(nickname, user.confirmation.code, email);

    return Result.Ok();
  }

  private async validateUser(
    user: User,
    nickname: string,
    password: string,
    email: string,
  ): Promise<Result> {
    //пользователь уже регистрировался через oAuth
    if (user.email === email && user.hash === 'no_pass') {
      const hash = await this.hashAdapter.generatePasswordHash(password);

      user.update({ hash });
      user.confirmation.update();

      await this.userRepo.save(user);
      this.createUserEvent(nickname, user.confirmation.code, email);
      return Result.Ok();
    }

    if (user.nickname === nickname && user.email === email) {
      const checkPass = await this.hashAdapter.checkPassword(
        password,
        user.hash,
      );

      if (checkPass && user.confirmation.status === 'NOT_CONFIRM') {
        user.confirmation.update();
        await this.userRepo.save(user);

        this.createUserEvent(nickname, user.confirmation.code, email);
        return Result.Ok();
      } else {
        throw new DomainError({
          tag: ErrorTag.VALIDATION_FAILED,
          message: UserDomainMessages.ALREADY_REGISTERED,
          metadata: {
            username: UserDomainMessages.ALREADY_REGISTERED_BY_USERNAME,
            email: UserDomainMessages.ALREADY_REGISTERED_BY_EMAIL,
          },
        });
      }
    }

    if (user.nickname === nickname) {
      throw new DomainError({
        tag: ErrorTag.VALIDATION_FAILED,
        message: UserDomainMessages.ALREADY_REGISTERED,
        metadata: {
          username: UserDomainMessages.ALREADY_REGISTERED_BY_USERNAME,
        },
      });
    }
    if (user.email === email) {
      throw new DomainError({
        tag: ErrorTag.VALIDATION_FAILED,
        message: UserDomainMessages.ALREADY_REGISTERED,
        metadata: {
          email: UserDomainMessages.ALREADY_REGISTERED_BY_EMAIL,
        },
      });
    }

    throw new DomainError({
      tag: ErrorTag.VALIDATION_FAILED,
      message: UserDomainMessages.ALREADY_REGISTERED,
      metadata: {
        username: UserDomainMessages.ALREADY_REGISTERED_BY_USERNAME,
        email: UserDomainMessages.ALREADY_REGISTERED_BY_EMAIL,
      },
    });
  }

  private createUserEvent(nickname: string, code: string, email: string) {
    const event = new CreateUserEvent(nickname, code, email);

    this.eventBus.publish(event);
  }
}
