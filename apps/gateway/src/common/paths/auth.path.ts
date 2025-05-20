import { join } from 'path';

export abstract class AuthPath {
  static readonly controller = 'auth';
  static readonly registration = 'registration';
  static readonly registrationConfirmation = 'registration-confirmation';
  static readonly registrationEmailResending = 'registration-email-resending';
  static readonly login = 'login';
  static readonly refreshToken = 'refresh-token';
  static readonly logout = 'logout';
  static readonly passwordRecovery = 'password-recovery';
  static readonly checkRecoveryCode = 'check-recovery-code';
  static readonly newPassword = 'new-password';
  static readonly google = 'google';
  static readonly googleRedirect = 'google/redirect';
  static readonly github = 'github';
  static readonly githubRedirect = 'github/redirect';
  static readonly me = 'me';

  static readonly fullRegistration = join(
    AuthPath.controller,
    AuthPath.registration,
  );

  static readonly fullRegistrationConfirmation = join(
    AuthPath.controller,
    AuthPath.registrationConfirmation,
  );
  static readonly fullRegistrationEmailResending = join(
    AuthPath.controller,
    AuthPath.registrationEmailResending,
  );
  static readonly fullLogin = join(AuthPath.controller, AuthPath.login);
  static readonly fullRefreshToken = join(
    AuthPath.controller,
    AuthPath.refreshToken,
  );
  static readonly fullLogout = join(AuthPath.controller, AuthPath.logout);
  static readonly fullPasswordRecovery = join(
    AuthPath.controller,
    AuthPath.passwordRecovery,
  );
  static readonly fullCheckRecoveryCode = join(
    AuthPath.controller,
    AuthPath.checkRecoveryCode,
  );
  static readonly fullNewPassword = join(
    AuthPath.controller,
    AuthPath.newPassword,
  );
  static readonly fullGoogle = join(AuthPath.controller, AuthPath.google);
  static readonly fullGoogleRedirect = join(
    AuthPath.controller,
    AuthPath.googleRedirect,
  );
  static readonly fullGithub = join(AuthPath.controller, AuthPath.github);
  static readonly fullGithubRedirect = join(
    AuthPath.controller,
    AuthPath.githubRedirect,
  );
  static readonly fullMe = join(AuthPath.controller, AuthPath.me);
  //static readonly full;
}
