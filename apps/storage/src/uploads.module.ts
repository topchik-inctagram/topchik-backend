import { ConfigModule } from '@nestjs/config';
import { Environments } from '../../common/config/enviroment.settings';
import { UploadsController } from './uploads.controller';
import configuration, {
  getFilePath,
} from './core/config/storage-configuration';
import { ImageModule } from './features/images/image.module';
import { AppLoggerService } from '../../common/logger/logger.service';
import { Module } from '@nestjs/common';
import { DbModule } from './core/db/db.module';

const envs = process.env.ENV as Environments;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [getFilePath(envs), '.env.a'],
      load: [configuration],
    }),
    DbModule,
    ImageModule,
  ],
  controllers: [UploadsController],
  providers: [AppLoggerService],
})
export class UploadsModule {}
