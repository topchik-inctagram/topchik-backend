import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CountryQueryRepo } from '../query.repos/country.query.repo';
import { CountryView } from '../../../../common/views/country.view';
import { getCountriesSwaggerDecorator } from '../../../../core/swagger/reference/decorators/get-countries.swagger.decorator';
import { CityView } from '../../../../common/views/city.view';
import { getCountryCitiesSwaggerDecorator } from '../../../../core/swagger/reference/decorators/get-country-cities.swagger.decorator';
import { IdParamDto } from '../../../../../../common/dtos/id-param.dto';

@ApiTags('Reference')
@Controller('reference/countries')
export class CountriesController {
  constructor(private countryQueryRepo: CountryQueryRepo) {}

  @Get()
  @getCountriesSwaggerDecorator()
  @HttpCode(HttpStatus.OK)
  async getAllCountries(): Promise<CountryView[]> {
    return this.countryQueryRepo.getCounties();
  }

  @Get(':id/cities')
  @getCountryCitiesSwaggerDecorator()
  @HttpCode(HttpStatus.OK)
  async getCountryCities(@Param() { id }: IdParamDto): Promise<CityView[]> {
    return this.countryQueryRepo.getCountryCities(id);
  }
}
