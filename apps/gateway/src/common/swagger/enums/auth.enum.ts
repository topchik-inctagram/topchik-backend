export enum AuthSwagger {
  login = 'Логинизация пользователя в системе',

  registration = 'Регистрация в системе',
  registrationOk = 'Регистрация прошла успешно. Мейл с кодом подтверждения отправлен на почту указанную при регистрации',

  confirm = 'Подтверждение регистрации',
  confirmOk = 'Подтверждение регистрации прошло успешно. Акк активирован.',

  resending = 'Переотправка письма с кодом подтверждения',
  resendingOk = 'Переотправка письма с кодом подтверждения прошла успешно. Мейл с кодом подтверждения отправлен на почту указанную при регистрации',

  rT = 'Генерируется новая пара токенов. Доступ по refreshToken в cookie. Возвращается JWT-accessToken в теле ответа и JWT-refreshToken в cookie (http-only, secure)',

  logout = 'Выход из системы. Доступ по refreshToken в cookie. Очистка токена в cookie',

  passRecovery = 'Смена пароля с подтверждением через мейл',
  passRecoveryOk = 'Смена пароля прошла успешно. Мейл с кодом подтверждения отправлен на почту указанную при регистрации',

  checkRecovery = 'Проверка валидности кода подтверждения смены пароля',
  checkRecoveryOk = 'Проверка валидности кода подтверждения смены пароля прошла успешно',

  newPass = 'Подтверждение нового пароля',
  newPassOk = 'Подтверждение нового пароля прошла успешно',

  jwtOk = 'Возвращается JWT-accessToken в теле ответа и JWT-refreshToken в cookie (http-only, secure)',

  google = 'Регистрация-логинизация через google',
  googleOk = 'Редирект данных на google-api произведён',
  googleRedirect = 'Редирект данных от google-api',
  googleRedirectOk = 'Регистрация-логинизация через google прошла успешно. Возвращается JWT-refreshToken в cookie (http-only, secure)',

  github = 'Регистрация-логинизация через github',
  githubOk = 'Редирект данных на github-api произведён',
  githubRedirect = 'Редирект данных от github-api',
  githubRedirectOk = 'Регистрация-логинизация через github прошла успешно. Возвращается JWT-refreshToken в cookie (http-only, secure)',

  throttler = 'Слишком много запросов. Если превышен лимит в 5 запросов за 10 секунд',
}
