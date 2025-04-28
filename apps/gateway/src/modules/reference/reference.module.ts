import { Module } from '@nestjs/common';
import { CountriesController } from './country-cities/api/controllers/countries.controller';
import { CountryQueryRepo } from './country-cities/repos/country.query.repo';
import { CountryRepo } from './country-cities/repos/country-repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './country-cities/domain/country.entity';
import { City } from './country-cities/domain/city.entity';

const queryCases = [];
const useCases = [];
const repos = [CountryQueryRepo, CountryRepo];
const adapters = [];

export const referenceModuleEntities = [Country, City];

@Module({
  imports: [TypeOrmModule.forFeature(referenceModuleEntities)],
  controllers: [CountriesController],
  providers: [...useCases, ...queryCases, ...repos, ...adapters],
  exports: [CountryRepo],
})
export class ReferenceModule {}
