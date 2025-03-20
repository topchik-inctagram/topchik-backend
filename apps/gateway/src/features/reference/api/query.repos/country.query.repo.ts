import { Injectable } from '@nestjs/common';
import { DbService } from '../../../global/application/db/db.service';
import { CountryView } from '../../../../core/views/country.view';
import { CityView } from '../../../../core/views/city.view';

@Injectable()
export class CountryQueryRepo {
  constructor(private dbService: DbService) {}

  async getCounties(): Promise<CountryView[]> {
    const countries = await this.dbService.country.findMany();

    return countries.length
      ? countries.map((country) => new CountryView(country))
      : [];
  }

  async getCountryCities(countryId: number): Promise<CityView[]> {
    const cities = await this.dbService.city.findMany({
      where: {
        countryId,
      },
    });
    return cities.length ? cities.map((city) => new CityView(city)) : [];
  }
}
