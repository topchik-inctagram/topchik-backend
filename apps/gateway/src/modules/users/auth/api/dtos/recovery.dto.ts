import { CodeApiProperty } from '../../../../../common/swagger/dtos/auth/code.swagger.dto';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Trim } from '../../../../../../../common/decorators/trim.decorator';

export class RecoveryDto {
  @CodeApiProperty()
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  @Trim()
  recoveryCode: string;
}
