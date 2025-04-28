import { ApiProperty } from '@nestjs/swagger';

export const RecaptchaTokenApiProperty = () =>
  ApiProperty({
    type: String,
    description: 'Токен, полученный от google-recaptcha',
    required: true,
  });
