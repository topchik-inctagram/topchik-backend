import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Trim } from '../../../../../../../common/decorators/trim.decorator';
import { EmailApiProperty } from '../../../../../common/swagger/dtos/auth/email.swagger.dto';
import { EMAIL_REG } from '../../../../../common/constants/dto.constants';

export class InputEmailDto {
  @EmailApiProperty()
  @IsString()
  @Trim()
  @Matches(EMAIL_REG)
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
