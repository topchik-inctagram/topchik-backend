import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageArrayValidatorPipe } from './validation/image-array.validator';
import {
  POSTS_FORMATS,
  POSTS_MAX_SIZE,
} from '../../../../common/constants/dto.constants';
import { CreatePostCommand } from '../application/use.cases/create-post.use-case';
import { CurrentUserId } from '../../../../../../common/decorators/user-id.decorator';

import { AccessTokenGuard } from '../../../users/auth/api/guards/access.guard';
import { FileListDto } from '../../../../../../storage/src/modules/images/application/dtos/file-list.dto';
import { UpdatePostCommand } from '../application/use.cases/update-post.use-case';
import { DeletePostCommand } from '../application/use.cases/delete-post.use-case';
import { DescriptionDto } from './dtos/description.dto';
import { PostView } from '../../../../common/views/post.view';
import { CursorQueryDto } from './dtos/cursor.dto';
import { IdParamDto } from '../../../../../../common/dtos/id-param.dto';
import { PostQueryRepo } from '../repos/post.query.repo';
import {
  PostsWithCursorView,
  PublicPostsWithCursorView,
} from '../../../../common/views/posts-with-cursor.view';
import { AccessPayloadType } from '../../../../common/adapters/jwt/jwt.adapter';
import { GetPostQueryCommand } from '../application/query.cases/get-post.query-case';
import { Result } from '../../../../core/results/result';
import { GetPostListQueryCommand } from '../application/query.cases/get-post-list.query-case';
import { GetUserPostListQueryCommand } from '../application/query.cases/get-user-post-list.query-case';
import { ApiResponseFactory } from '../../../../common/swagger/api-responses/api-response.factory';
import { PostsEnum } from '../../../../common/swagger/enums/posts.enum';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private postQueryRepo: PostQueryRepo,
  ) {}

  @Get()
  @ApiResponseFactory(PostsEnum.getPosts, {
    200: {
      message: PostsEnum.getPosts_Ok,
      body: PublicPostsWithCursorView,
    },
  })
  async getPosts(
    @Query() { cursor }: CursorQueryDto,
  ): Promise<PostsWithCursorView | []> {
    const result = await this.queryBus.execute<
      GetPostListQueryCommand,
      Result<PostsWithCursorView>
    >(new GetPostListQueryCommand(cursor));

    if (!result.isSuccess) throw result.err;
    return result.value;
  }

  @Get('user/:id')
  @ApiResponseFactory(PostsEnum.getUserPosts, {
    200: {
      message: PostsEnum.getUserPosts_Ok,
      body: PostsWithCursorView,
    },
  })
  async getUserPosts(
    @Query() { cursor }: CursorQueryDto,
    @Param() { id }: IdParamDto,
  ): Promise<PostsWithCursorView | []> {
    const result = await this.queryBus.execute<
      GetUserPostListQueryCommand,
      Result<PostsWithCursorView>
    >(new GetUserPostListQueryCommand(cursor, id));

    if (!result.isSuccess) throw result.err;
    return result.value;
  }

  @Get(':id')
  @ApiResponseFactory(PostsEnum.getById, {
    200: {
      message: PostsEnum.getById_Ok,
      body: PostView,
    },
    404: null,
  })
  @HttpCode(HttpStatus.OK)
  async getPost(@Param() { id }: IdParamDto): Promise<PostView> {
    const result = await this.queryBus.execute<
      GetPostQueryCommand,
      Result<PostView>
    >(new GetPostQueryCommand(id));

    if (!result.isSuccess) throw result.err;
    return result.value;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponseFactory(PostsEnum.createPost, {
    201: {
      message: PostsEnum.createPost_Ok,
      body: PostView,
    },
    400: null,
    401: null,
    bearer: true,
    many_images: 'Картинки поста. Максимальное количество 10 штук',
  })
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async createPost(
    @UploadedFiles(
      new ImageArrayValidatorPipe({
        fileType: POSTS_FORMATS,
        maxSize: POSTS_MAX_SIZE,
      }),
    )
    files: Array<Express.Multer.File>,
    @CurrentUserId() { userId }: AccessPayloadType,
  ): Promise<PostView> {
    const result = await this.commandBus.execute(
      new CreatePostCommand(
        userId,
        files.map(
          (file) =>
            new FileListDto(file.buffer, file.originalname, file.mimetype),
        ),
      ),
    );

    if (!result.isSuccess) throw result.err;
    return this.postQueryRepo.findByIdOrFail(result.value);
  }

  @Put(':id')
  @ApiResponseFactory(PostsEnum.updateById, {
    204: null,
    400: null,
    401: null,
    403: null,
    404: null,
    bearer: true,
  })
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param() { id }: IdParamDto,
    @Body() { description }: DescriptionDto,
    @CurrentUserId()
    { userId }: AccessPayloadType,
  ) {
    const result = await this.commandBus.execute(
      new UpdatePostCommand(userId, id, description),
    );

    if (!result.isSuccess) throw result.err;
    return;
  }

  @Delete(':id')
  @ApiResponseFactory(PostsEnum.deleteById, {
    204: null,
    401: null,
    403: null,
    404: null,
    bearer: true,
  })
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @Param() { id }: IdParamDto,
    @CurrentUserId() { userId }: AccessPayloadType,
  ) {
    const result = await this.commandBus.execute(
      new DeletePostCommand(userId, id),
    );

    if (!result.isSuccess) throw result.err;
    return;
  }
}
