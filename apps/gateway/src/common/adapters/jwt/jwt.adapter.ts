import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../../core/config/configuration';
import { JwtSettings } from '../../../core/config/jwt.settings';

export type PayloadType = {
  userId: number;
  deviceId: string;
};

export type DecodedTokenType<T> = {
  iat: number;
  exp: number;
} & T;

@Injectable()
export class JwtAdapter {
  jwtConfig: JwtSettings;

  constructor(
    private configService: ConfigService<Configuration, true>,
    private jwtService: JwtService,
  ) {
    this.jwtConfig = this.configService.get('jwtSettings');
  }

  async createRefreshToken(payload: PayloadType): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.jwtConfig.REFRESH_TOKEN_EXP,
      secret: this.jwtConfig.REFRESH_TOKEN_SECRET,
    });
  }

  async createAccessToken(payload: PayloadType): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.jwtConfig.ACCESS_TOKEN_EXP,
      secret: this.jwtConfig.ACCESS_TOKEN_SECRET,
    });
  }

  async decodeToken<T>(token: string): Promise<DecodedTokenType<T>> {
    return this.jwtService.decode(token);
  }
}
