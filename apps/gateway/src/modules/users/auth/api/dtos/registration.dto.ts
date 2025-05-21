import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import {
  PASS_MAX_LENGTH,
  PASS_MIN_LENGTH,
  PASSWORD_REG,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REG,
} from '../../../../../common/constants/dto.constants';
import { Trim } from '../../../../../../../common/decorators/trim.decorator';
import { InputEmailDto } from './input-email.dto';
import { UsernameApiProperty } from '../../../../../common/swagger/dtos/auth/username.swagger.dto';
import { PasswordApiProperty } from '../../../../../common/swagger/dtos/auth/password.swagger.dto';
import { IsTrue } from '../../../../../../../common/decorators/is-true.decorator';
import { AgreementApiProperty } from '../../../../../common/swagger/dtos/auth/agreemaent.swagger.dto';

export class RegistrationInputDto extends InputEmailDto {
  @UsernameApiProperty()
  @IsString()
  @Trim()
  @Length(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH)
  @Matches(USERNAME_REG)
  username: string;

  @PasswordApiProperty()
  @IsString()
  @Trim()
  @Length(PASS_MIN_LENGTH, PASS_MAX_LENGTH)
  @Matches(PASSWORD_REG)
  password: string;

  @AgreementApiProperty()
  @IsTrue({ message: 'Should be only true' })
  @IsBoolean()
  @IsNotEmpty()
  agreement: boolean;
}
