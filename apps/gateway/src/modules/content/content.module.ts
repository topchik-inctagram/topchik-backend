import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PostRepo } from './posts/repos/post.repo';
import { CreatePostUseCase } from './posts/application/use.cases/create-post.use-case';
import { PostController } from './posts/api/post.controller';
import { DeletePostUseCase } from './posts/application/use.cases/delete-post.use-case';
import { UpdatePostUseCase } from './posts/application/use.cases/update-post.use-case';
import { GetPostQueryCase } from './posts/application/query.cases/get-post.query-case';
import { GetPostListQueryCase } from './posts/application/query.cases/get-post-list.query-case';
import { PostQueryRepo } from './posts/repos/post.query.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts/domain/post.entity';
import { PostImage } from './posts/domain/post-image.entity';
import { GetUserPostListQueryCase } from './posts/application/query.cases/get-user-post-list.query-case';

const queryCases = [
  GetPostQueryCase,
  GetPostListQueryCase,
  GetUserPostListQueryCase,
];
const useCases = [CreatePostUseCase, DeletePostUseCase, UpdatePostUseCase];
const repos = [PostRepo, PostQueryRepo];

const adapters = [];

export const contentModuleEntities = [Post, PostImage];

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature(contentModuleEntities)],
  controllers: [PostController],
  providers: [...useCases, ...queryCases, ...repos, ...adapters],
})
export class ContentModule {}
