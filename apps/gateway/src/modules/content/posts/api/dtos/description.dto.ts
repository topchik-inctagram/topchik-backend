import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { Trim } from '../../../../../../../common/decorators/trim.decorator';
import {
  POST_DESCRIPTION_MAX_LENGTH,
  POST_DESCRIPTION_REG,
} from '../../../../../common/constants/dto.constants';

export class DescriptionDto {
  @MaxLength(POST_DESCRIPTION_MAX_LENGTH)
  @Matches(POST_DESCRIPTION_REG)
  @Trim()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  description: string | null = null;
}
