import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../../../core/config/configuration';
import { UnauthorizedError } from '../../../../../../common/exeptions/custom.exeption';
import {
  DecodedTokenType,
  PayloadType,
} from '../../../../core/adapters/jwt/jwt.adapter';
import { DevicesRepo } from '../../devices/repos/device.repo';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(
    private configService: ConfigService<Configuration, true>,
    private readonly devicesRepository: DevicesRepo,
  ) {
    const config = configService.get('jwtSettings');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(
    payload: DecodedTokenType<PayloadType>,
  ): Promise<{ userId: number }> {
    if (!payload) throw new UnauthorizedError('Wrong credentials');

    const device = await this.devicesRepository.findById(payload.deviceId);

    if (!device) throw new UnauthorizedError('Wrong credentials');

    if (payload.iat !== device.iat)
      throw new UnauthorizedError('Wrong credentials');

    return { userId: payload.userId };
  }
}
