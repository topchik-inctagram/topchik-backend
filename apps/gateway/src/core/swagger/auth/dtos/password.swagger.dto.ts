import {
  PASS_MAX_LENGTH,
  PASS_MIN_LENGTH,
  PASSWORD_REG,
} from '../../../constants/dto.constants';
import { ApiProperty } from '@nestjs/swagger';

export const PasswordApiProperty = () =>
  ApiProperty({
    type: String,
    description: 'Пароль',
    example: 'StRo0NgP@SSWoRD',
    required: true,
    pattern: `${PASSWORD_REG}`,
    minLength: PASS_MIN_LENGTH,
    maxLength: PASS_MAX_LENGTH,
  });
