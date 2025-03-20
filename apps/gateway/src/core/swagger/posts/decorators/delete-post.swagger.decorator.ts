import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PostsEnum } from '../posts.enum';
import { FORBIDDEN, NOT_FOUND, UNAUTHORIZED } from '../../swagger.constants';

export function DeletePostSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: PostsEnum.deleteById,
    }),
    ApiBearerAuth(),
    ApiNoContentResponse({
      description: PostsEnum.deleteById_Ok,
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
  );
}
