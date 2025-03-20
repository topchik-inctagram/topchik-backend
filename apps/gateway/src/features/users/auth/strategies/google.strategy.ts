import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProviderInputType, ProviderType } from '../decorators/provider.type';
import { Configuration } from '../../../../core/config/configuration';
import { OauthSetting } from '../../../../core/config/oauth.setting';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService<Configuration, true>) {
    const oauthConfig = configService.get<OauthSetting>('oauthSetting');

    super({
      clientID: oauthConfig.OAUTH_GOOGLE_ID,
      clientSecret: oauthConfig.OAUTH_GOOGLE_SECRET,
      callbackURL: oauthConfig.OAUTH_GOOGLE_REDIRECT_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<ProviderInputType> {
    const { id, emails } = profile;

    return {
      type: ProviderType.GOOGLE,
      providerId: id,
      email: emails[0].value,
    };
  }
}
