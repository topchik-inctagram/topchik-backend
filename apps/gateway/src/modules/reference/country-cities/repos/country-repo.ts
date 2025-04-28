import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from '../domain/country.entity';
import { Repository } from 'typeorm';
import { City } from '../domain/city.entity';

@Injectable()
export class CountryRepo {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async getCountryById(countryId: number) {
    return this.countryRepository.findOne({
      where: {
        id: countryId,
      },
    });
  }

  async getCityById(cityId: number) {
    return this.cityRepository.findOne({
      where: {
        id: cityId,
      },
    });
  }

  async getCityWithCounty(cityId: number, countryId?: number) {
    return this.cityRepository.findOne({
      relations: {
        country: true,
      },
      where: {
        id: cityId,
        ...(countryId ? { countryId } : {}),
      },
    });
  }
}
