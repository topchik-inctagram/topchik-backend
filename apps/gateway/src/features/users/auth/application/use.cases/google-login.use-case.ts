import { BaseProvideLoginUseCase } from './base-provider-login.use-case';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IUserRepo, UserRepo } from '../../repos/user.repo';
import { HashAdapter } from '../../../../../core/adapters/hash/hash.adapter';
import { JwtAdapter } from '../../../../../core/adapters/jwt/jwt.adapter';
import { DevicesRepo } from '../../../devices/repos/device.repo';

export class GoogleLoginCommand {
  constructor(
    public providerId: string,
    public provider: string,
    public email: string,
    public ip: string,
    public deviceTitle: string,
  ) {}
}

@CommandHandler(GoogleLoginCommand)
export class GoogleLoginUseCase
  extends BaseProvideLoginUseCase
  implements ICommandHandler<GoogleLoginCommand>
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
