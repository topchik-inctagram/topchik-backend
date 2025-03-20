import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '../../../../../../../../common/decorators/trim.decorator';
import { PasswordApiProperty } from '../../../../../../core/swagger/auth/dtos/password.swagger.dto';
import {
  PASS_MAX_LENGTH,
  PASS_MIN_LENGTH,
} from '../../../../../../core/constants/dto.constants';
import { RecoveryDto } from './recovery.dto';

export class NewPassDto extends RecoveryDto {
  @PasswordApiProperty()
  @Length(PASS_MIN_LENGTH, PASS_MAX_LENGTH)
  @IsNotEmpty()
  @IsString()
  @Trim()
  newPassword: string;
}
