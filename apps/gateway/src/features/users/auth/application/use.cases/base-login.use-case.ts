import {
  DecodedTokenType,
  JwtAdapter,
  PayloadType,
} from '../../../../../common/adapters/jwt/jwt.adapter';
import { DevicesRepo } from '../../../devices/repos/device.repo';
import { Result } from '../../../../../core/results/result';
import { randomUUID } from 'crypto';

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

    const payload = {
      userId,
      deviceId,
    };

    const refreshToken = await this.jwtAdapter.createRefreshToken(payload);
    // create access token
    const accessToken = await this.jwtAdapter.createAccessToken(payload);
    // decode token to take iat and exp
    const tokenInfo: DecodedTokenType<PayloadType> =
      await this.jwtAdapter.decodeToken(refreshToken);

    // create device session and save it
    const newDevice = {
      id: deviceId,
      title,
      ip,
      exp: tokenInfo.exp,
      iat: tokenInfo.iat,
      userId,
    };
    console.log('***BEFORE CREATE DEVICE***');
    console.log(newDevice);
    await this.devicesRepository.create(newDevice);

    return Result.Ok({ refreshToken, accessToken });
  }
}
