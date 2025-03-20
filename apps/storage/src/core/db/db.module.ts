import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvatarEntity } from '../../features/images/domain/avatar.entity';
import { PostEntity } from '../../features/images/domain/post.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          url: configService.get('databaseSettings.DATABASE_URL'),
          ssl: !configService.get('environmentSettings.isDevelopment'),
          entities: [AvatarEntity, PostEntity],
          synchronize: false,
          autoLoadEntities: false,
          logging: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DbModule {}
