import { ApiProperty } from '@nestjs/swagger';
import {
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REG,
} from '../../../constants/dto.constants';

export const UsernameApiProperty = () =>
  ApiProperty({
    type: String,
    description: 'Ник',
    example: 'FelixArgyle',
    required: true,
    pattern: `${USERNAME_REG}`,
    minLength: USERNAME_MIN_LENGTH,
    maxLength: USERNAME_MAX_LENGTH,
  });
