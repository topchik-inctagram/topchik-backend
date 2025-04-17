import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseProvideLoginUseCase } from './base-provider-login.use-case';
import { Inject } from '@nestjs/common';
import { IUserRepo, UserRepo } from '../../repos/user.repo';
import { HashAdapter } from '../../../../../common/adapters/hash/hash.adapter';
import { JwtAdapter } from '../../../../../common/adapters/jwt/jwt.adapter';
import { DevicesRepo } from '../../../devices/repos/device.repo';

export class GithubLoginCommand {
  constructor(
    public providerId: string,
    public provider: string,
    public email: string,
    public ip: string,
    public deviceTitle: string,
  ) {}
}

@CommandHandler(GithubLoginCommand)
export class GithubLoginUseCase
  extends BaseProvideLoginUseCase
  implements ICommandHandler<GithubLoginCommand>
{
  constructor(
    @Inject(UserRepo) protected readonly userRepo: IUserRepo,
    protected readonly hashAdapter: HashAdapter,
    protected readonly jwtAdapter: JwtAdapter,
    protected readonly devicesRepository: DevicesRepo,
  ) {
    super(userRepo, hashAdapter, jwtAdapter, devicesRepository);
  }
}
