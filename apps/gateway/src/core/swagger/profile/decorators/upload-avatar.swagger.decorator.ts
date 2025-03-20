import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProfileEnum } from '../profile.enum';
import { UNAUTHORIZED } from '../../swagger.constants';
import { BadRequestResponse } from '../../../../../../common/views/response.view';
import { ImageResponseView } from '../../../../../../common/views/image-response.view';

export function UploadAvatarSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: ProfileEnum.uploadAvatar,
    }),
    ApiBearerAuth(),
    ApiConsumes('multipart/form-data'), // Указываем, что ожидается multipart/form-data
    ApiBody({
      description: 'Загружаемое фото профиля',
      required: true,
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary', // Указываем, что это файл
          },
        },
      },
    }),
    ApiCreatedResponse({
      description: ProfileEnum.uploadAvatarOk,
      type: ImageResponseView,
    }),
    ApiUnauthorizedResponse({
      description: UNAUTHORIZED,
    }),
    ApiBadRequestResponse({
      description: ProfileEnum.uploadAvatar_400,
      type: BadRequestResponse,
    }),
  );
}
