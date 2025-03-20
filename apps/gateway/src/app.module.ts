import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import configuration, { getFilePath } from './core/config/configuration';
import { Environments } from '../../common/config/enviroment.settings';
import { UserModule } from './features/users/user.module';
import { OriginModule } from './features/global/global.module';
import { ContentModule } from './features/content/content.module';
import { ReferenceModule } from './features/reference/reference.module';

const envs = process.env.ENV as Environments;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [getFilePath(envs), '.env'],
      load: [configuration],
    }),
    OriginModule,
    UserModule,
    ContentModule,
    ReferenceModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
