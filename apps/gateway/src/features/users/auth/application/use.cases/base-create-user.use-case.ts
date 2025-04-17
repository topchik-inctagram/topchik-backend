import { HashAdapter } from '../../../../../common/adapters/hash/hash.adapter';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { Inject } from '@nestjs/common';
import { IUserRepo, UserRepo } from '../../repos/user.repo';
import { Result } from '../../../../../core/results/result';
import { ConfirmationType } from './registration.use-case';
import { RecoveryType } from './pass-recovery.use-case';
import { UserEntity } from '../../../../global/application/db/domain/user.entity';

export abstract class BaseCreateUserUseCase {
  protected constructor(
    @Inject(UserRepo) private readonly userRepo: IUserRepo,
    private readonly hashAdapter: HashAdapter,
  ) {}

  abstract execute<T>(userDto: T): Promise<Result>;

  async createUser(
    nickname: string,
    password: string,
    email: string,
  ): Promise<Result> {
    const hash = await this.hashAdapter.generatePasswordHash(password);

    const user = UserEntity.create(nickname, email, hash);

    const res = await this.userRepo.create(user);

    return Result.Ok(res);
  }

  private createConfirmation(): ConfirmationType {
    return {
      code: randomUUID(),
      exp: add(new Date(), {
        hours: 1,
        minutes: 30,
      }),
      status: 'NOT_CONFIRM',
    };
  }

  private createRecovery(): RecoveryType {
    return {
      code: randomUUID(),
      exp: add(new Date(), {
        hours: 1,
        minutes: 30,
      }),
      status: 'DONE',
    };
  }
}
