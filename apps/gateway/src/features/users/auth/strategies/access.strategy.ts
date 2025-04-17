import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../../../core/config/configuration';
import { UnauthorizedError } from '../../../../../../common/exeptions/custom.exeption';
import {
  DecodedTokenType,
  PayloadType,
} from '../../../../common/adapters/jwt/jwt.adapter';
import { UserRepo } from '../repos/user.repo';

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
    payload: DecodedTokenType<PayloadType>,
  ): Promise<{ userId: number }> {
    if (!payload) throw new UnauthorizedError('Wrong credentials');

    const user = await this.usersRepository.findById(payload.userId);

    if (!user) throw new UnauthorizedError('Wrong credentials');

    return { userId: payload.userId };
  }
}
