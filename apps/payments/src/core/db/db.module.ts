import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccountPlan } from './models/account-plan.model';
import { Order } from './models/order.model';
import { Payment } from './models/payment.model';

const models = [AccountPlan, Order, Payment];

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          dialect: 'postgres',
          uri: configService.get('databaseSettings.DATABASE_URL'),
          autoLoadModels: true,
          synchronize: true,
          logging: false,
          models,
          define: {
            timestamps: true,
            paranoid: true, // Включает мягкое удаление
          },
        };
      },
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
