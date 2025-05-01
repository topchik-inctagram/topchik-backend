import { Injectable } from '@nestjs/common';
import { CountryView } from '../../../../common/views/country.view';
import { CityView } from '../../../../common/views/city.view';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from '../domain/country.entity';
import { Repository } from 'typeorm';
import { City } from '../domain/city.entity';

@Injectable()
export class CountryQueryRepo {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async getCounties(): Promise<CountryView[]> {
    const countries = await this.countryRepository.find();

    return countries.length
      ? countries.map((country) => new CountryView(country))
      : [];
  }

  async getCountryCities(countryId: number): Promise<CityView[]> {
    const cities = await this.cityRepository.find({
      where: {
        countryId,
      },
    });
    return cities.length ? cities.map((city) => new CityView(city)) : [];
  }
}
