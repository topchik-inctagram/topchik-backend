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
} from '../../../../core/constants/dto.constants';
import { CreatePostCommand } from '../application/use.cases/create-post.use-case';
import { CurrentUserId } from '../../../../../../common/decorators/user-id.decorator';

import { AccessTokenGuard } from '../../../users/auth/guards/access.guard';
import { ImagesDto } from '../../../../../../common/dtos/images.dto';
import { UpdatePostCommand } from '../application/use.cases/update-post.use-case';
import { DeletePostCommand } from '../application/use.cases/delete-post.use-case';
import { DescriptionDto } from './dtos/description.dto';
import { PostView } from '../../../../core/views/post.view';
import { getPostByIdSwaggerDecorator } from '../../../../core/swagger/posts/decorators/get-post-by-id.swagger.decorator';
import { DeletePostSwaggerDecorator } from '../../../../core/swagger/posts/decorators/delete-post.swagger.decorator';
import { UpdatePostSwaggerDecorator } from '../../../../core/swagger/posts/decorators/update-post.swagger.decorator';
import { CreatePostSwaggerDecorator } from '../../../../core/swagger/posts/decorators/create-post.swagger.decorator';
import { CursorQueryDto } from './dtos/cursor.dto';
import { IdParamDto } from '../../../../../../common/dtos/id-param.dto';
import { PostQueryRepo } from './query.repos/post.query.repo';
import { PostsWithCursorView } from '../../../../core/views/posts-with-cursor.view';
import { GetUserPostsSwaggerDecorator } from '../../../../core/swagger/posts/decorators/get-user-posts.swagger.decorator';
import { NotFoundError } from '../../../../../../common/exeptions/custom.exeption';
import { PostsMessages } from '../../../../core/constants/message.constants';
import { GetPostsSwaggerDecorator } from '../../../../core/swagger/posts/decorators/get-posts.swagger.decorator';
import { GetPostsQueryCommand } from '../application/query.cases/get-posts.query-case';
import { PayloadType } from '../../../../core/adapters/jwt/jwt.adapter';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private postQueryRepo: PostQueryRepo,
  ) {}

  @Get()
  @GetPostsSwaggerDecorator()
  async getPosts(
    @Query() { cursor }: CursorQueryDto,
  ): Promise<PostsWithCursorView | []> {
    return this.queryBus.execute(new GetPostsQueryCommand(cursor));
  }

  @Get('user/:id')
  @GetUserPostsSwaggerDecorator()
  async getUserPosts(
    @Query() { cursor }: CursorQueryDto,
    @Param() { id }: IdParamDto,
  ): Promise<PostsWithCursorView | []> {
    return this.postQueryRepo.findUserPosts(cursor, id);
  }

  @Get(':id')
  @getPostByIdSwaggerDecorator()
  @HttpCode(HttpStatus.OK)
  async getPost(@Param() { id }: IdParamDto): Promise<PostView> {
    const result = await this.postQueryRepo.findById(id);

    if (!result) throw new NotFoundError(PostsMessages.NOT_EXIST);
    return result;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreatePostSwaggerDecorator()
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
    @CurrentUserId() { userId }: PayloadType,
  ): Promise<PostView> {
    const result = await this.commandBus.execute(
      new CreatePostCommand(
        userId,
        files.map(
          (file) =>
            new ImagesDto(file.buffer, file.originalname, file.mimetype),
        ),
      ),
    );

    if (!result.isSuccess) throw result.err;
    return result.value;
  }

  @Put(':id')
  @UpdatePostSwaggerDecorator()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param() { id }: IdParamDto,
    @Body() { description }: DescriptionDto,
    @CurrentUserId()
    { userId }: PayloadType,
  ) {
    const result = await this.commandBus.execute(
      new UpdatePostCommand(userId, id, description),
    );

    if (!result.isSuccess) throw result.err;
    return;
  }

  @Delete(':id')
  @DeletePostSwaggerDecorator()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @Param() { id }: IdParamDto,
    @CurrentUserId() { userId }: PayloadType,
  ) {
    const result = await this.commandBus.execute(
      new DeletePostCommand(userId, id),
    );

    if (!result.isSuccess) throw result.err;
    return;
  }
}
