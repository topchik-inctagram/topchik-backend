import { Injectable } from '@nestjs/common';
import { DbService } from '../../global/application/db/db.service';

@Injectable()
export class CountryRepo {
  constructor(private dbService: DbService) {}

  async getCountryById(countryId: number) {
    return this.dbService.country.findUnique({
      where: {
        id: countryId,
      },
    });
  }

  async getCityById(cityId: number) {
    return this.dbService.city.findUnique({
      where: {
        id: cityId,
      },
    });
  }

  async getCityWithCounty(cityId: number, countryId?: number) {
    return this.dbService.city.findUnique({
      include: {
        country: true,
      },
      where: {
        id: cityId,
        ...(countryId ? { countryId } : {}),
      },
    });
  }
}
