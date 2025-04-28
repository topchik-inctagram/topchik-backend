import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Configuration } from '../config/configuration';
import { DatabaseSettings } from '../../../../common/config/data-base.settings';
import { PingDbUseCase } from './application/ping-db.use-case';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<Configuration, true>) => {
        const config = configService.get<DatabaseSettings>('databaseSettings');
        return {
          type: 'postgres',
          url: config.DATABASE_URL,
          autoLoadEntities: true,
          synchronize: false,
          logging: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [PingDbUseCase],
  exports: [TypeOrmModule], // Экспортируем, чтобы другие модули могли использовать forFeature()
})
export class DatabaseModule {}
