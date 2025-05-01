import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { CustomOAuthError } from '../../../../../common/exeptions/oauth.exeption';

export class GithubOauthGuard extends AuthGuard('github') {
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
      throw new CustomOAuthError('githubOauth');
    } else {
      return user;
    }
  }
}
