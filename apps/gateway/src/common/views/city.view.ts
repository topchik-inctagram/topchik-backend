import { ApiProperty } from '@nestjs/swagger';
import { City } from '../../modules/reference/country-cities/domain/city.entity';

export class CityView {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name_ru: string;

  @ApiProperty()
  name_en: string;

  @ApiProperty()
  countryId: number;

  constructor({ id, name_ru, name_en, countryId }: City) {
    this.id = id;
    this.countryId = countryId;
    this.name_en = name_en;
    this.name_ru = name_ru;
  }

  static builder(city: City) {
    return new this(city);
  }
}
