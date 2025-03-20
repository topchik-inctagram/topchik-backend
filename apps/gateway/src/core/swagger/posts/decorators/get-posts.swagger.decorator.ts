import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { PostsEnum } from '../posts.enum';
import { PublicPostsWithCursorView } from '../../../views/posts-with-cursor.view';

export function GetPostsSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: PostsEnum.getPosts,
    }),
    ApiOkResponse({
      description: PostsEnum.getPosts_Ok,
      type: PublicPostsWithCursorView,
    }),
  );
}
