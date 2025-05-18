import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from '../domain/country.entity';
import { Repository } from 'typeorm';
import { City } from '../domain/city.entity';
import { RepositoryNotFoundError } from '../../../../../../common/errors/repository-not-found.error';

@Injectable()
export class CountryRepo {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async getCountryByIdOrFail(countryId: number): Promise<Country> {
    const result = await this.countryRepository.findOne({
      where: {
        id: countryId,
      },
    });

    if (!result) {
      throw new RepositoryNotFoundError(
        `Country with id ${countryId} not found`,
      );
    }

    return result;
  }

  async getCityByIdOrFail(cityId: number): Promise<City> {
    const result = await this.cityRepository.findOne({
      where: {
        id: cityId,
      },
    });
    if (!result) {
      throw new RepositoryNotFoundError(`City with id ${cityId} not found`);
    }

    return result;
  }

  async getCityWithCountyOrFail(
    cityId: number,
    countryId?: number,
  ): Promise<City> {
    const result = await this.cityRepository.findOne({
      relations: {
        country: true,
      },
      where: {
        id: cityId,
        ...(countryId ? { countryId } : {}),
      },
    });

    if (!result) {
      throw new RepositoryNotFoundError(`City with id ${cityId} not found`);
    }

    return result;
  }
}
