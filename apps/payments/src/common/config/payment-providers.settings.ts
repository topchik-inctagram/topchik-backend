import { EnvironmentVariable } from '../../../../gateway/src/common/config/configuration';
import { IsString } from 'class-validator';

export class PaymentProvidersSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}

  @IsString()
  PAYPAL_CLIENT_ID: string = this.environmentVariables.PAYPAL_CLIENT_ID;

  @IsString()
  PAYPAL_SECRET: string = this.environmentVariables.PAYPAL_SECRET;

  @IsString()
  PAYPAL_WEBHOOK: string = this.environmentVariables.PAYPAL_WEBHOOK;

  @IsString()
  STRIPE_SECRET: string = this.environmentVariables.STRIPE_SECRET;

  @IsString()
  STRIPE_WEBHOOK: string = this.environmentVariables.STRIPE_WEBHOOK;

  @IsString()
  FRONTEND_SUCCESS_URL: string = this.environmentVariables.FRONTEND_SUCCESS_URL;

  @IsString()
  FRONTEND_CANCELED_URL: string =
    this.environmentVariables.FRONTEND_CANCELED_URL;
}
