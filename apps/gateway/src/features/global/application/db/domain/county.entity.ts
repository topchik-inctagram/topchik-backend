import { Country } from '../../../../../../prisma/client';

export class CountyEntity implements Country {
  id: number;
  name_ru: string;
  name_en: string;

  constructor(country: Country) {
    this.id = country.id;
    this.name_en = country.name_en;
    this.name_ru = country.name_ru;
  }

  static builder(country: Country) {
    return new this(country);
  }
}
