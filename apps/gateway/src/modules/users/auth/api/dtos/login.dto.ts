import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Trim } from '../../../../../../../common/decorators/trim.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginInputDto {
  @ApiProperty()
  @IsString()
  @Trim()
  @Length(6, 20)
  @Matches(
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!\"#$%&'()*+,\-.\/:\;<=>?@\[\\\]^_`{|}~]).*$/,
  )
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @Trim()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
