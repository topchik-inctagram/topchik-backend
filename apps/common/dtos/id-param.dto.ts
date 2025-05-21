import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class IdParamDto {
  @IsInt({ message: 'ID must be an integer.' })
  @Min(1, { message: 'ID must be a positive integer.' })
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
