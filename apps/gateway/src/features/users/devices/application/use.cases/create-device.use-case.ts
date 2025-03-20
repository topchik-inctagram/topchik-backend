import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepo } from '../../repos/device.repo';
import { JwtAdapter } from '../../../../../core/adapters/jwt/jwt.adapter';
import { BaseLoginUseCase } from '../../../auth/application/use.cases/base-login.use-case';
import { Result } from '../../../../../core/results/result';

export type TokensType = {
  refreshToken: string;
  accessToken: string;
};

export class CreateDeviceCommand {
  constructor(
    public userId: number,
    public ip: string,
    public title: string,
  ) {}
}

@CommandHandler(CreateDeviceCommand)
export class CreateDeviceUseCase
  extends BaseLoginUseCase
  implements ICommandHandler<CreateDeviceCommand>
{
  constructor(
    protected readonly jwtAdapter: JwtAdapter,
    protected readonly devicesRepository: DevicesRepo,
  ) {
    super(jwtAdapter, devicesRepository);
  }

  execute(command: CreateDeviceCommand): Promise<Result<TokensType>> {
    return this.login(command);
  }
}
