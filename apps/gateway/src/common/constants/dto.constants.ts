export const PASSWORD_REG =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!\"#$%&'()*+,\-.\/:\;<=>?@\[\\\]^_`{|}~]).*$/;
export const PASS_MAX_LENGTH = 20;
export const PASS_MIN_LENGTH = 6;

export const USERNAME_REG = /^[a-zA-Z0-9_-]+$/;
export const USERNAME_MAX_LENGTH = 30;
export const USERNAME_MIN_LENGTH = 6;

export const FIRST_NAME_REG = /^[A-Za-zА-Яа-я]+$/;
export const FIRST_NAME_MAX_LENGTH = 50;
export const FIRST_NAME_MIN_LENGTH = 1;

export const LAST_NAME_MAX_LENGTH = 50;
export const LAST_NAME_MIN_LENGTH = 1;
export const LAST_NAME_REG = /^[A-Za-zА-Яа-я]+$/;

export const EMAIL_REG = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const DATE_OF_BIRTH_REG = /^(\d{2}\.\d{2}\.\d{4})?$/;

export const COUNTRY_MAX_LENGTH = 50;
export const COUNTRY_REG = /^[A-Za-zА-Яа-я\s]*$/;

export const CITY_MAX_LENGTH = 50;
export const CITY_REG = /^[A-Za-zА-Яа-я\s]*$/;

export const USER_DESCRIPTION_MAX_LENGTH = 200;
export const USER_DESCRIPTION_REG =
  /[0-9A-Za-zА-Яа-я!@#$%^&*()_\-+=\[\]{}|\\:;"'<>,.?/`~№ ]/;

export const USER_MAX_AGE = 100;
export const USER_MIN_AGE = 13;

export const AVATAR_FORMATS = '.(png|jpeg|jpg)';
export const AVATAR_MAX_SIZE = 10485760;
//export const  AVATAR_HEIGHT=
//export const  AVATAR_WIDTH=

export const POSTS_FORMATS = '.(png|jpeg|jpg)';
export const POSTS_MAX_SIZE = 20971520;

export const POST_DESCRIPTION_REG =
  /^[0-9A-Za-zА-Яа-яёЁ\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
export const POST_DESCRIPTION_MAX_LENGTH = 500;
