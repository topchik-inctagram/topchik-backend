import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { AppLoggerService } from '../../../../../common/logger/logger.service';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class PingDbUseCase {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(PingDbUseCase.name);
  }

  @Cron('*/4 * * * *') // Каждые 4 минуты
  public async pingDatabase() {
    try {
      await this.dataSource.query('SELECT 1');

      this.logger.debug(`Database ping successful`);
    } catch (error: unknown) {
      this.logger.error(`Database ping failed: ${error}`);
    }
  }
}
