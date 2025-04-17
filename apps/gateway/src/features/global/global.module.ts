import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OriginMiddleware } from './middlewares/origin.middleware';
import { OriginService } from './application/origin/origin.adapter';
import { AsyncStorageAdapter } from '../../common/adapters/local-storage/local-storage.adapter';
import { ScheduleModule } from '@nestjs/schedule';
import { CqrsModule } from '@nestjs/cqrs';
import { DbService } from './application/db/db.service';
import { PingDbUseCase } from './application/db/ping-db.use-case';
import { AppLoggerService } from '../../../../common/logger/logger.service';

@Global()
@Module({
  imports: [ScheduleModule.forRoot(), CqrsModule.forRoot()],
  providers: [
    OriginService,
    OriginMiddleware,
    AsyncStorageAdapter,
    DbService,
    PingDbUseCase,
    AppLoggerService,
  ],
  exports: [OriginService, AsyncStorageAdapter, DbService, AppLoggerService],
})
export class OriginModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OriginMiddleware).forRoutes('*');
  }
}
