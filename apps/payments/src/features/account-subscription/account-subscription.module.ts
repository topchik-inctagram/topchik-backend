import { Module } from '@nestjs/common';
import { AccountSubscriptionController } from './api/account-subscription.controller';
import { AccountSubscriptionRepo } from './repos/account-subscription.repo';
import { AccountSubscriptionQueryRepo } from './api/query.repos/account-subscription.query.repo';
import { StripeStrategy } from '../../common/strategies/stripe.strategy';
import { PayPalStrategy } from '../../common/strategies/paypal.strategy';
import { PaymentContext } from '../../common/strategies/payment-context';
import { CreateSubscriptionUseCase } from './application/use.cases/create-subscription.use-case';

const queryCases = [];
const useCases = [CreateSubscriptionUseCase];
const repos = [AccountSubscriptionRepo, AccountSubscriptionQueryRepo];
const strategies = [StripeStrategy, PayPalStrategy];
const contexts = [PaymentContext];

@Module({
  imports: [],
  controllers: [AccountSubscriptionController],
  providers: [...useCases, ...queryCases, ...repos, ...strategies, ...contexts],
})
export class AccountSubscriptionModule {}
