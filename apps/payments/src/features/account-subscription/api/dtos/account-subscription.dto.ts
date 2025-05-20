import { PaymentProvider } from '../../../../common/db/enum';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class AccountSubscriptionDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsEnum(PaymentProvider)
  @IsNotEmpty()
  provider: PaymentProvider;
}
