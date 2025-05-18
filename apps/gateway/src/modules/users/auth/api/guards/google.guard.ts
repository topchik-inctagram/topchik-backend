import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiError } from '../../../../../../../common/errors/api.error';
import { ErrorTag } from '../../../../../../../common/errors/error.tag';

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {
  constructor() {
    super();
  }

  handleRequest<Profile>(err: any | null, user: Profile) {
    if (err || !user) {
      throw new ApiError({
        message: `Couldn't sign in with Google. Please try again or use another method`,
        tag: ErrorTag.UNAUTHORIZED,
        oauth: true,
      });
    } else {
      return user;
    }
  }
}
