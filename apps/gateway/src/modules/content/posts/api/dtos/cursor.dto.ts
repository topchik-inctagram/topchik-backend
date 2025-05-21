import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CursorQueryDto {
  @ApiPropertyOptional({
    description: `Курсор, это id последнего поста в массиве. \n
  Он передается во view модели вместе с массивом постов, так что вычислять ничего не нужно. \n
  Работает следующим образом: \n
  1 страница:  GET api/v1/entity?cursor=0 или GET api/v1/entity \n
  в ответе прилетит значение курсора для следующего запроса(для 2й страницы), например {cursor:5}, \n
  2 страница: GET api/v1/entity?cursor=5 \n и тд.
  `,
  })
  @IsInt({ message: 'Cursor must be an integer.' })
  @Type(() => Number)
  @IsOptional()
  cursor: number | null = null;
}
