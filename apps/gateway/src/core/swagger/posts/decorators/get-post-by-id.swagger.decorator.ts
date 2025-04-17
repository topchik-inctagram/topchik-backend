import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { NOT_FOUND } from '../../swagger.constants';
import { PostsEnum } from '../posts.enum';
import { PostView } from '../../../../common/views/post.view';

export function getPostByIdSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: PostsEnum.getById,
    }),
    ApiOkResponse({
      description: PostsEnum.getById_Ok,
      type: PostView,
    }),
    ApiNotFoundResponse({
      description: NOT_FOUND,
    }),
  );
}
