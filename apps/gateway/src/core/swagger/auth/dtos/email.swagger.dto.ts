import { ApiProperty } from '@nestjs/swagger';
import { EMAIL_REG } from '../../../constants/dto.constants';

export const EmailApiProperty = () =>
  ApiProperty({
    type: String,
    description: 'Адрес электронной почты пользователя. ',
    example: 'someemail@mail.ru',
    required: true,
    pattern: `${EMAIL_REG}`,
  });
