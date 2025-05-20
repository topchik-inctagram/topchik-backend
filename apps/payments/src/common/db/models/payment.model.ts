import { BaseModel } from './base.model';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { Order } from './order.model';
import { Currency, PaymentProvider, PaymentStatus } from '../enum';

@Table({ tableName: 'Payments', timestamps: true, paranoid: true })
export class Payment extends BaseModel<Payment> {
  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  orderId: number;

  @BelongsTo(() => Order)
  order: Order;

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
    type: DataType.ENUM(...Object.values(PaymentStatus)),
    allowNull: false,
  })
  status: PaymentStatus;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentProvider)),
    allowNull: false,
  })
  provider: PaymentProvider;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  transactionId: string; // ID транзакции в Stripe/PayPal

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  fee?: number; // Комиссия платежной системы

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  errorDetails?: string; // Сообщение об ошибке, если есть
}
