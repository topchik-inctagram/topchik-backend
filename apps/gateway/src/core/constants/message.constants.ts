export const ERROR_INCORRECT_CONFIRMATION_CODE = 'Wrong confirmation';
export const EXPIRED_CONFIRMATION_CODE = 'Expired confirmation';
export const EXPIRED_RECOVERY_CODE = 'Expired recovery';

export const ALREADY_EXISTS = 'Already exists';
export const NOT_EXIST = 'Not exist';
export const NOT_FOUND = 'Not found';
export const SUCCESS = 'Success';

export const FORBIDDEN = 'Not in your own';

export const USER_NOT_FOUND = 'User not found';

export const ALREADY_CONFIRM = 'Your email has been confirmed';

export enum UserMessages {
  NOT_EXIST = "User doesn't exist",
  NOT_EXIST_BY_EMAIL = "User with this email doesn't exist",
  ALREADY_REGISTERED_BY_EMAIL = 'User with this email is already registered',
  ALREADY_REGISTERED_BY_USERNAME = 'User with this username is already registered',
  INCORRECT_EMAIL_OR_PASS = 'The email or password are incorrect. Try again please',
  NOT_NEW_PASS = 'The new password must not be the same as the old password',
  ALREADY_CONFIRM = 'Your email has been confirmed',
  NOT_CONFIRM = 'User not confirmed',

  EXPIRED_CODE = 'Looks like the verification link has expired',
}

export enum DeviceMessages {
  NOT_EXIST = "Device doesn't exist",
  FORBIDDEN = 'This device not in your own',
}

export enum AvatarMessages {
  ERROR_UPLOAD = 'Avatar loading error',
  ERROR_DELETE = 'Avatar delete error',
  AVATAR_NOT_EXIST = 'User has not avatar',
}

export enum PostsMessages {
  ERROR_UPLOAD = 'Images loading error',
  NOT_EXIST = `Post doesn't exist`,
}
