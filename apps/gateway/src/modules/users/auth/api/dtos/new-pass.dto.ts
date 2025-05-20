import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Trim } from '../../../../../../../common/decorators/trim.decorator';
import { PasswordApiProperty } from '../../../../../common/swagger/dtos/auth/password.swagger.dto';
import {
  PASS_MAX_LENGTH,
  PASS_MIN_LENGTH,
  PASSWORD_REG,
} from '../../../../../common/constants/dto.constants';
import { RecoveryDto } from './recovery.dto';

export class NewPassDto extends RecoveryDto {
  @PasswordApiProperty()
  @Length(PASS_MIN_LENGTH, PASS_MAX_LENGTH)
  @IsNotEmpty()
  @IsString()
  @Matches(PASSWORD_REG)
  @Trim()
  newPassword: string;
}
