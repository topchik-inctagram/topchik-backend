import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../../../../common/config/configuration';
import { UnauthorizedError } from '../../../../../../../common/exeptions/custom.exeption';
import {
  AccessPayloadType,
  DecodedTokenType,
} from '../../../../../common/adapters/jwt/jwt.adapter';
import { UserRepo } from '../../../repos/user.repo';

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
    if (!payload) throw new UnauthorizedError('Wrong credentials');

    const user = await this.usersRepository.findByIdOrFail(payload.userId);

    if (!user) throw new UnauthorizedError('Wrong credentials');

    return { userId: payload.userId };
  }
}
