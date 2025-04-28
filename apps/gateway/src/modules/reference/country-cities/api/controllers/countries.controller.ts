import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CountryQueryRepo } from '../../repos/country.query.repo';
import { CountryView } from '../../../../../common/views/country.view';
import { CityView } from '../../../../../common/views/city.view';
import { IdParamDto } from '../../../../../../../common/dtos/id-param.dto';
import { ApiResponseFactory } from '../../../../../common/swagger/api-responses/api-response.factory';
import { ReferenceEnum } from '../../../../../common/swagger/enums/reference.enum';

@ApiTags('Reference')
@Controller('reference/countries')
export class CountriesController {
  constructor(private countryQueryRepo: CountryQueryRepo) {}

  @Get()
  @ApiResponseFactory(ReferenceEnum.getCountries, {
    200: {
      message: ReferenceEnum.getCountries_OK,
      body: CountryView,
      array: true,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getAllCountries(): Promise<CountryView[]> {
    return this.countryQueryRepo.getCounties();
  }

  @Get(':id/cities')
  @ApiResponseFactory(ReferenceEnum.getCities, {
    200: {
      message: ReferenceEnum.getCities_OK,
      body: CityView,
      array: true,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getCountryCities(@Param() { id }: IdParamDto): Promise<CityView[]> {
    return this.countryQueryRepo.getCountryCities(id);
  }
}
