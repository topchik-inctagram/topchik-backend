import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { PostsEnum } from '../posts.enum';
import { PostsWithCursorView } from '../../../../common/views/posts-with-cursor.view';

export function GetUserPostsSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: PostsEnum.getUserPosts,
    }),
    ApiOkResponse({
      description: PostsEnum.getUserPosts_Ok,
      type: PostsWithCursorView,
    }),
  );
}
