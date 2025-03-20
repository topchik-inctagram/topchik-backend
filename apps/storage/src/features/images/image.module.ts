import { Module } from '@nestjs/common';
import { AvatarController } from './api/controllers/avatar.controller';

import { ImageRepo } from './repos/image.repo';
import { SaveAvatarUseCase } from './aplication/use-cases/save-avatar.use-case';
import { SharpAdapter } from '../../core/adapters/sharp.adapter';
import { StorageS3Adapter } from '../../core/adapters/storage-s3.adapter';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteImageUseCase } from './aplication/use-cases/delete-image.use-case';
import { ImageQueryRepo } from './repos/image.query.repo';
import { PostController } from './api/controllers/post.controller';
import { SavePostsImagesUseCase } from './aplication/use-cases/save-posts-images.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvatarEntity } from './domain/avatar.entity';
import { PostEntity } from './domain/post.entity';

//const guards = [];
//const eventHandlers = [];
const useCases = [
  SaveAvatarUseCase,
  DeleteImageUseCase,
  SavePostsImagesUseCase,
];

const repos = [ImageRepo, ImageQueryRepo];

const adapters = [SharpAdapter, StorageS3Adapter];

@Module({
  imports: [TypeOrmModule.forFeature([AvatarEntity, PostEntity]), CqrsModule],
  controllers: [AvatarController, PostController],
  providers: [...useCases, ...repos, ...adapters],
})
export class ImageModule {}
