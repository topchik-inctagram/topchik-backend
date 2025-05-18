import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../../../../common/config/configuration';
import {
  AccessPayloadType,
  DecodedTokenType,
} from '../../../../../common/adapters/jwt/jwt.adapter';
import { UserRepo } from '../../../repos/user.repo';
import { ApiError } from '../../../../../../../common/errors/api.error';
import { ErrorTag } from '../../../../../../../common/errors/error.tag';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(
    private configService: ConfigService<Configuration, true>,
    private readonly usersRepository: UserRepo,
  ) {
    const config = configService.get('jwtSettings');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(
    payload: DecodedTokenType<AccessPayloadType>,
  ): Promise<AccessPayloadType> {
    try {
      if (!payload) throw new Error();

      const user = await this.usersRepository.findByIdOrFail(payload.userId);

      return { userId: user.id };
    } catch (error) {
      throw new ApiError({
        message: 'User credentials did not match',
        tag: ErrorTag.UNAUTHORIZED,
      });
    }
  }
}
