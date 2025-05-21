import { Injectable } from '@nestjs/common';
import { PayPalStrategy } from './paypal.strategy';
import { PaymentStrategy } from './base-strategy.interface';
import { StripeStrategy } from './stripe.strategy';
import { PaymentProvider } from '../db/enum';

@Injectable()
export class PaymentContext {
  private strategies: Map<PaymentProvider, PaymentStrategy>;

  constructor(
    private readonly stripeStrategy: StripeStrategy,
    private readonly paypalStrategy: PayPalStrategy,
  ) {
    this.strategies = new Map<PaymentProvider, PaymentStrategy>([
      [PaymentProvider.STRIPE, this.stripeStrategy],
      [PaymentProvider.PAYPAL, this.paypalStrategy],
    ]);
  }

  getStrategy(provider: PaymentProvider): PaymentStrategy {
    const strategy = this.strategies.get(provider);
    if (!strategy) {
      //todo change to custom error

      throw new Error(`Payment strategy for method ${provider} not found`);
    }
    return strategy;
  }
}
