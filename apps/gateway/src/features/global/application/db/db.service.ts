import {
  Injectable,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '../../../../../prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DbService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  constructor(
    private readonly configService: ConfigService<
      { databaseSettings: { DATABASE_URL: string } },
      true
    >,
  ) {
    super({
      datasources: {
        db: {
          url: configService.get('databaseSettings.DATABASE_URL', {
            infer: true,
          }),
        },
      },
      log: ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async onApplicationShutdown() {
    // Завершаем соединения при завершении работы приложения
    await this.$disconnect();
  }
}
