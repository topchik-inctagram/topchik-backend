import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PostsEnum } from '../posts.enum';
import {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  UNAUTHORIZED,
} from '../../swagger.constants';
import { BadRequestResponse } from '../../../../../../common/views/response.view';

export function UpdatePostSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: PostsEnum.updateById,
    }),
    ApiBearerAuth(),
    ApiNoContentResponse({
      description: PostsEnum.updateById_Ok,
    }),
    ApiNotFoundResponse({
      description: NOT_FOUND,
    }),
    ApiForbiddenResponse({
      description: FORBIDDEN,
    }),
    ApiUnauthorizedResponse({
      description: UNAUTHORIZED,
    }),
    ApiBadRequestResponse({
      description: BAD_REQUEST,
      type: BadRequestResponse,
    }),
  );
}
