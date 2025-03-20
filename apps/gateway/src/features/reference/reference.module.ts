import { Module } from '@nestjs/common';
import { CountriesController } from './api/controllers/countries.controller';
import { CountryQueryRepo } from './api/query.repos/country.query.repo';
import { CountryRepo } from './repos/country-repo';

const queryCases = [];
const useCases = [];
const repos = [CountryQueryRepo, CountryRepo];
const adapters = [];

@Module({
  imports: [],
  controllers: [CountriesController],
  providers: [...useCases, ...queryCases, ...repos, ...adapters],
  exports: [CountryRepo],
})
export class ReferenceModule {}
