import { BaseModel } from './base.model';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { Currency, OrderStatus } from '../enum';
import { AccountPlan } from './account-plan.model';
import { Payment } from './payment.model';

@Table({ tableName: 'Orders', timestamps: true, paranoid: true })
export class Order extends BaseModel<Order> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => AccountPlan)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  planId: number;

  @BelongsTo(() => AccountPlan)
  plan: AccountPlan;

  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
    allowNull: false,
  })
  status: OrderStatus;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.ENUM(...Object.values(Currency)),
    allowNull: false,
  })
  currency: Currency;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expirationDate: Date;

  @HasMany(() => Payment)
  payments: Payment[];
}

const order = new Order();

order.amount = 5;

await order.save();
