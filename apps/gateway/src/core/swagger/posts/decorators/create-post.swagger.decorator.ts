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
import { PostsEnum } from '../posts.enum';
import { BAD_REQUEST, UNAUTHORIZED } from '../../swagger.constants';
import { PostView } from '../../../views/post.view';
import { BadRequestResponse } from '../../../../../../common/views/response.view';

export function CreatePostSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: PostsEnum.createPost,
    }),
    ApiBearerAuth(),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'Картинки поста. Максимальное количество 10 штук',
      required: true,
      schema: {
        type: 'object',
        properties: {
          files: {
            type: 'array',
            format: 'binary',
          },
        },
      },
    }),
    ApiCreatedResponse({
      description: PostsEnum.createPost_Ok,
      type: PostView,
    }),
    ApiBadRequestResponse({
      description: BAD_REQUEST,
      type: BadRequestResponse,
    }),
    ApiUnauthorizedResponse({
      description: UNAUTHORIZED,
    }),
  );
}
