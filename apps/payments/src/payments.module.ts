import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { Environments } from '../../common/config/enviroment.settings';
import { ConfigModule } from '@nestjs/config';
import configuration, {
  getFilePath,
} from './common/config/payments-configuration';
import { DatabaseModule } from './common/db/db.module';
import { AccountSubscriptionModule } from './features/account-subscription/account-subscription.module';
import { AppLoggerService } from '../../common/logger/logger.service';

const envs = process.env.ENV as Environments;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [getFilePath(envs), '.env.a'],
      load: [configuration],
    }),
    DatabaseModule,
    AccountSubscriptionModule,
  ],
  controllers: [PaymentsController],
  providers: [AppLoggerService],
})
export class PaymentsModule {}
