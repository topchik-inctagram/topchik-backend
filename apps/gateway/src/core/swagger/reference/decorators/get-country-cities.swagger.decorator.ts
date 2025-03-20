import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ReferenceEnum } from '../reference.enum';
import { CityView } from '../../../views/city.view';

export function getCountryCitiesSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: ReferenceEnum.getCities,
    }),
    ApiOkResponse({
      description: ReferenceEnum.getCities_OK,
      type: CityView,
      isArray: true,
    }),
  );
}
