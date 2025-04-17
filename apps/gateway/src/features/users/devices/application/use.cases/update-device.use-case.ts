import { DevicesRepo } from '../../repos/device.repo';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokensType } from './create-device.use-case';
import {
  DecodedTokenType,
  JwtAdapter,
  PayloadType,
} from '../../../../../common/adapters/jwt/jwt.adapter';
import { Result } from '../../../../../core/results/result';

export class UpdateDeviceCommand {
  constructor(
    public userId: number,
    public deviceId: string,
    public ip: string,
    public title: string,
  ) {}
}

@CommandHandler(UpdateDeviceCommand)
export class UpdateDeviceUseCase
  implements ICommandHandler<UpdateDeviceCommand>
{
  constructor(
    private readonly jwtAdapter: JwtAdapter,
    private readonly devicesRepository: DevicesRepo,
  ) {}

  async execute({
    userId,
    deviceId,
    title,
    ip,
  }: UpdateDeviceCommand): Promise<Result<TokensType>> {
    const payload = {
      userId,
      deviceId,
    };

    // create refresh token
    const refreshToken = await this.jwtAdapter.createRefreshToken(payload);

    // create access token
    const accessToken = await this.jwtAdapter.createAccessToken(payload);

    // decode token to take iat and exp
    const tokenInfo: DecodedTokenType<PayloadType> =
      await this.jwtAdapter.decodeToken(refreshToken);

    // update device session
    await this.devicesRepository.update({
      id: deviceId,
      ip,
      title,
      iat: tokenInfo.iat!,
      exp: tokenInfo.exp!,
      userId,
    });

    return Result.Ok({ refreshToken, accessToken });
  }
}
