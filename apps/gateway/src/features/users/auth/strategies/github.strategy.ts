import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ProviderType } from '../decorators/provider.type';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { OauthSetting } from '../../../../core/config/oauth.setting';
import { Configuration } from '../../../../core/config/configuration';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  oauthConfig: OauthSetting;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<Configuration, true>,
  ) {
    const oauthConfig = configService.get('oauthSetting', {
      infer: true,
    });

    super({
      clientID: oauthConfig.GITHUB_CLIENT_ID,
      clientSecret: oauthConfig.GITHUB_CLIENT_SECRET,
      callbackURL: oauthConfig.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    });
    this.oauthConfig = configService.get<OauthSetting>('oauthSetting');
  }

  async validate(accessToken: string, _refreshToken: string, profile: any) {
    let email = profile.emails?.[0]?.value || null;

    if (!email) {
      const url = this.oauthConfig.GITHUB_API_GET_EMAIL_URL;

      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      const primaryEmail = response.data.find(
        (emailObj: Record<string, string>) => emailObj?.primary,
      )?.email;
      email = primaryEmail || null;
    }

    return {
      type: ProviderType.GIT_HUB,
      providerId: profile.id,
      email,
    };
  }
}
