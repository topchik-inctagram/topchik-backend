import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { Currency, PeriodType } from '../enum';

@Table({ tableName: 'AccountPlans', timestamps: true, paranoid: true })
export class AccountPlan extends BaseModel<AccountPlan> {
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.ENUM(...Object.values(PeriodType)),
    allowNull: false,
  })
  period: PeriodType;

  @Column({
    type: DataType.ENUM(...Object.values(Currency)),
    allowNull: false,
  })
  currency: Currency;
}
