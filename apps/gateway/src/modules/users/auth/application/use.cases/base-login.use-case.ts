import {
  DecodedTokenType,
  JwtAdapter,
  RefreshPayloadType,
} from '../../../../../common/adapters/jwt/jwt.adapter';
import { DevicesRepo } from '../../../devices/repos/device.repo';
import { Result } from '../../../../../core/results/result';
import { randomUUID } from 'crypto';
import { Device } from '../../../domain/device.entity';

type BaseLoginInputType = {
  title: string;
  ip: string;
  userId: number;
};

export type TokensType = {
  refreshToken: string;
  accessToken: string;
};

export abstract class BaseLoginUseCase {
  protected constructor(
    protected readonly jwtAdapter: JwtAdapter,
    protected readonly devicesRepository: DevicesRepo,
  ) {}

  async login({
    title,
    ip,
    userId,
  }: BaseLoginInputType): Promise<Result<TokensType>> {
    const deviceId = randomUUID();

    const refreshToken = await this.jwtAdapter.createRefreshToken({
      userId,
      deviceId,
    });
    // create access token
    const accessToken = await this.jwtAdapter.createAccessToken({ userId });
    // decode token to take iat and exp
    const tokenInfo: DecodedTokenType<RefreshPayloadType> =
      await this.jwtAdapter.decodeToken(refreshToken);

    // create device session and save it
    const newDevice = Device.create({
      id: deviceId,
      title,
      ip,
      exp: tokenInfo.exp,
      iat: tokenInfo.iat,
      userId,
    });

    await this.devicesRepository.save(newDevice);

    return Result.Ok({ refreshToken, accessToken });
  }
}
