import { City, Country } from '../../../../../../prisma/client';

export class CityEntity implements City {
  id: number;
  name_ru: string;
  name_en: string;
  countryId: number;

  constructor(city: City) {
    this.id = city.id;
    this.countryId = city.countryId;
    this.name_en = city.name_en;
    this.name_ru = city.name_ru;
  }

  static builder(city: City & { country?: Country }) {
    return new this(city);
  }
}
