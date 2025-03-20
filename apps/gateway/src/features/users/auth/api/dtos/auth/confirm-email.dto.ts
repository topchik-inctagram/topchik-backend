import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Trim } from '../../../../../../../../common/decorators/trim.decorator';
import { CodeApiProperty } from '../../../../../../core/swagger/auth/dtos/code.swagger.dto';

export class ConfirmEmailDto {
  @CodeApiProperty()
  @IsUUID(null, { message: 'Invalid confirmation code' })
  @IsNotEmpty()
  @IsString()
  @Trim()
  code: string;
}
