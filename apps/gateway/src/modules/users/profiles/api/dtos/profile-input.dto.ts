import { UsernameApiProperty } from '../../../../../common/swagger/dtos/auth/username.swagger.dto';
import {
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { Trim } from '../../../../../../../common/decorators/trim.decorator';
import {
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_MIN_LENGTH,
  FIRST_NAME_REG,
  LAST_NAME_MAX_LENGTH,
  LAST_NAME_MIN_LENGTH,
  LAST_NAME_REG,
  USER_DESCRIPTION_MAX_LENGTH,
  USER_DESCRIPTION_REG,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REG,
} from '../../../../../common/constants/dto.constants';
import { IsAgeValid } from '../validation/age.validator';

export class ProfileInputDto {
  @UsernameApiProperty()
  @IsString()
  @Trim()
  @Length(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH)
  @Matches(USERNAME_REG)
  username: string;

  @IsString()
  @Trim()
  @Length(FIRST_NAME_MIN_LENGTH, FIRST_NAME_MAX_LENGTH)
  @Matches(FIRST_NAME_REG)
  firstName: string;

  @IsString()
  @Trim()
  @Length(LAST_NAME_MIN_LENGTH, LAST_NAME_MAX_LENGTH)
  @Matches(LAST_NAME_REG)
  lastName: string;

  @IsAgeValid()
  @IsISO8601()
  @IsOptional()
  dateOfBirth: string | null = null;

  @IsNumber()
  @IsOptional()
  cityId: number | null = null;

  @IsNumber()
  @IsOptional()
  countryId: number | null = null;

  @IsString()
  @Trim()
  @MaxLength(USER_DESCRIPTION_MAX_LENGTH)
  @Matches(USER_DESCRIPTION_REG)
  @IsOptional()
  aboutMe: string | null = null;
}
