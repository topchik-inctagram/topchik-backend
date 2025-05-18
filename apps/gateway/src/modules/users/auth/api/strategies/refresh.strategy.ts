import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { DevicesRepo } from '../../../devices/repos/device.repo';
import {
  DecodedTokenType,
  RefreshPayloadType,
} from '../../../../../common/adapters/jwt/jwt.adapter';
import { Configuration } from '../../../../../common/config/configuration';
import { ApiError } from '../../../../../../../common/errors/api.error';
import { ErrorTag } from '../../../../../../../common/errors/error.tag';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService<Configuration, true>,
    private readonly devicesRepository: DevicesRepo,
  ) {
    const refreshTokenSecret = configService.get(
      'jwtSettings.REFRESH_TOKEN_SECRET',
      {
        infer: true,
      },
    );

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request.cookies.refreshToken;
          if (!data) return null;
          return data;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: refreshTokenSecret,
    });
  }

  async validate(
    payload: DecodedTokenType<RefreshPayloadType>,
  ): Promise<RefreshPayloadType> {
    try {
      if (!payload) throw new Error();

      const device = await this.devicesRepository.findByIdOrFail(
        payload.deviceId,
      );

      if (!device) throw new Error('Wrong credentials');

      if (payload.iat !== device.iat) throw new Error('Wrong credentials');

      return {
        userId: payload.userId,
        deviceId: payload.deviceId,
      };
    } catch (error) {
      throw new ApiError({
        message: 'User credentials did not match',
        tag: ErrorTag.UNAUTHORIZED,
      });
    }
  }
}
