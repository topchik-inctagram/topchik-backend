import { Module } from '@nestjs/common';
import { ImageRepo } from './repositories/image.repo';
import { SharpAdapter } from '../../common/adapters/sharp.adapter';
import { StorageS3Adapter } from '../../common/adapters/storage-s3.adapter';
import { CqrsModule } from '@nestjs/cqrs';
import { ImageQueryRepo } from './repositories/image.query.repo';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ImageEntity } from './domain/image.entity';
import { ImageController } from './api/image.controller';
import { SaveImageListUseCase } from './application/save-image-list.use-case';
import { SaveImageUseCase } from './application/save-image.use-case';
import { ImageService } from './application/image.service';

//const guards = [];
//const eventHandlers = [];
const useCases = [SaveImageListUseCase, SaveImageUseCase];

const repos = [ImageRepo, ImageQueryRepo];

const adapters = [SharpAdapter, StorageS3Adapter, ImageService];

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity]), CqrsModule],
  controllers: [ImageController],
  providers: [...useCases, ...repos, ...adapters],
})
export class ImageModule {}
