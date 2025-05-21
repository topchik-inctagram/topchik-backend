import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OriginMiddleware } from './origin/origin.middleware';
import { OriginService } from './origin/origin.adapter';
import { AsyncStorageAdapter } from '../adapters/local-storage/local-storage.adapter';
import { ScheduleModule } from '@nestjs/schedule';
import { CqrsModule } from '@nestjs/cqrs';
import { AppLoggerService } from '../../../../common/logger/logger.service';
import { ImageService } from '../adapters/image/image.adapter';
import { ImageRepo } from '../adapters/image/image.repository';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../domain/image.entity';

export const globalModuleEntities = [Image];

@Global()
@Module({
  imports: [
    ScheduleModule.forRoot(),
    CqrsModule.forRoot(),
    HttpModule,
    TypeOrmModule.forFeature(globalModuleEntities),
  ],
  providers: [
    OriginService,
    OriginMiddleware,
    AsyncStorageAdapter,
    AppLoggerService,
    ImageService,
    ImageRepo,
  ],
  exports: [OriginService, AsyncStorageAdapter, AppLoggerService, ImageService],
})
export class OriginModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OriginMiddleware).forRoutes('*');
  }
}
