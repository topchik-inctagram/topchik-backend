import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CursorQueryDto {
  @ApiPropertyOptional({
    description: `Курсор, это id последнего поста в массиве. \n
  Он передается во view модели вместе с массивом постов, так что вычислять ничего не нужно. \n
  На первой странице курсор не нужен`,
  })
  @IsInt({ message: 'Cursor must be an integer.' })
  @Type(() => Number)
  @IsOptional()
  cursor: number | null = null;
}
