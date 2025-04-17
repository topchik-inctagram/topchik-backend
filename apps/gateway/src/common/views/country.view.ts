import { ApiProperty } from '@nestjs/swagger';
import { Country } from '../../../prisma/client';

export class CountryView {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name_ru: string;

  @ApiProperty()
  name_en: string;

  constructor({ id, name_ru, name_en }: Country) {
    this.id = id;
    this.name_en = name_en;
    this.name_ru = name_ru;
  }

  static builder(country: Country) {
    return new this(country);
  }
}
