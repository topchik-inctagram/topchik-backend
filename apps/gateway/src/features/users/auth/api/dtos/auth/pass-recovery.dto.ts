import { InputEmailDto } from './input-email.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../../../../../../../common/decorators/trim.decorator';
import { RecaptchaTokenApiProperty } from '../../../../../../core/swagger/auth/dtos/recaptcha-token.swagger.dto';

export class PassRecoveryDto extends InputEmailDto {
  @RecaptchaTokenApiProperty()
  @IsString()
  @Trim()
  @IsNotEmpty()
  token: string;
}
