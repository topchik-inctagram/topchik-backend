import { Module } from '@nestjs/common';
import { ImageService } from '../../core/adapters/image/image.adapter';
import { HttpModule } from '@nestjs/axios';
import { PostRepo } from './posts/repos/post.repo';
import { CreatePostUseCase } from './posts/application/use.cases/create-post.use-case';
import { PostController } from './posts/api/post.controller';
import { DeletePostUseCase } from './posts/application/use.cases/delete-post.use-case';
import { UpdatePostUseCase } from './posts/application/use.cases/update-post.use-case';
import { GetPostQueryCase } from './posts/application/query.cases/get-post.query-case';
import { GetPostsQueryCase } from './posts/application/query.cases/get-posts.query-case';
import { PostQueryRepo } from './posts/api/query.repos/post.query.repo';

const queryCases = [GetPostQueryCase, GetPostsQueryCase];
const useCases = [CreatePostUseCase, DeletePostUseCase, UpdatePostUseCase];
const repos = [PostRepo, PostQueryRepo];

const adapters = [ImageService];

@Module({
  imports: [HttpModule],
  controllers: [PostController],
  providers: [...useCases, ...queryCases, ...repos, ...adapters],
})
export class ContentModule {}
