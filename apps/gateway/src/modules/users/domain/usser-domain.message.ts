export enum UserDomainMessages {
  NOT_EXIST = "User doesn't exist",
  NOT_EXIST_BY_EMAIL = "User with this email doesn't exist",
  ALREADY_REGISTERED = 'User is already registered',
  ALREADY_REGISTERED_BY_EMAIL = 'User with this email is already registered',
  ALREADY_REGISTERED_BY_USERNAME = 'User with this username is already registered',
  INCORRECT_PASS = 'The password is incorrect',
  NOT_NEW_PASS = 'The new password must not be the same as the old password',
  ALREADY_CONFIRM = 'Your email has been confirmed',
  NOT_CONFIRM = 'User not confirmed',

  EXPIRED_CODE = 'Looks like the verification link has expired',
}
