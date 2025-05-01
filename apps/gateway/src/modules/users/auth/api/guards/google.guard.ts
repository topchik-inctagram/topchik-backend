import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomOAuthError } from '../../../../../common/exeptions/oauth.exeption';

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {
  constructor() {
    super();
  }

  handleRequest<Profile>(
    err: any | null,
    user: Profile,
    _info: {},
    _context: ExecutionContext,
    _status?: any,
  ) {
    if (err || !user) {
      throw new CustomOAuthError('googleOauth');
    } else {
      return user;
    }
  }
}
