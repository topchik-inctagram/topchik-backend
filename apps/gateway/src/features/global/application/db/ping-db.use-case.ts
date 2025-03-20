import { DbService } from './db.service';
import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { AppLoggerService } from '../../../../../../common/logger/logger.service';

@Injectable()
export class PingDbUseCase {
  constructor(
    private dbService: DbService,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(PingDbUseCase.name);
  }

  @Cron('*/1 * * * *') // Каждые 4 минуты
  async pingDatabase() {
    try {
      await this.dbService.$queryRaw`SELECT 1`;

      console.log('PING');
    } catch (error: unknown) {
      this.logger.error(`Database ping failed: ${error}`);
    }
  }
}
