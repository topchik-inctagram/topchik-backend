import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ReferenceEnum } from '../reference.enum';
import { CountryView } from '../../../../common/views/country.view';

export function getCountriesSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: ReferenceEnum.getCountries,
    }),
    ApiOkResponse({
      description: ReferenceEnum.getCountries_OK,
      type: CountryView,
      isArray: true,
    }),
  );
}
