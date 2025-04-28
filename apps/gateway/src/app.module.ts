import { Module } from '@nestjs/common';
import { AppController } from './common/app/app.controller';
import { ConfigModule } from '@nestjs/config';
import configuration, { getFilePath } from './common/config/configuration';
import { Environments } from '../../common/config/enviroment.settings';
import { UserModule } from './modules/users/user.module';
import { OriginModule } from './common/global/global.module';
import { ContentModule } from './modules/content/content.module';
import { ReferenceModule } from './modules/reference/reference.module';
import { DatabaseModule } from './common/db/database.module';

const envs = process.env.ENV as Environments;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [getFilePath(envs), '.env'],
      load: [configuration],
    }),
    DatabaseModule,
    OriginModule,
    UserModule,
    ContentModule,
    ReferenceModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
