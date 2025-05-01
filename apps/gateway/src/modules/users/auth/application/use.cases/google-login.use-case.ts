import { BaseProvideLoginUseCase } from './base-provider-login.use-case';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepo } from '../../../repos/user.repo';
import { HashAdapter } from '../../../../../common/adapters/hash/hash.adapter';
import { JwtAdapter } from '../../../../../common/adapters/jwt/jwt.adapter';
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
    protected readonly userRepo: UserRepo,
    protected readonly hashAdapter: HashAdapter,
    protected readonly jwtAdapter: JwtAdapter,
    protected readonly devicesRepository: DevicesRepo,
  ) {
    super(userRepo, hashAdapter, jwtAdapter, devicesRepository);
  }
}
