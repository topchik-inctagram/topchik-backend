import { PaymentProvider } from '../../../../common/db/enum';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentContext } from '../../../../common/strategies/payment-context';

export class CreateSubscriptionCommand {
  constructor(
    public userId: number,
    public provider: PaymentProvider,
    public accountPlanId: number,
  ) {}
}

@CommandHandler(CreateSubscriptionCommand)
export class CreateSubscriptionUseCase
  implements ICommandHandler<CreateSubscriptionCommand>
{
  constructor(private readonly paymentContext: PaymentContext) {}

  async execute({
    userId,
    accountPlanId,
    provider,
  }: CreateSubscriptionCommand) {
    // todo logic
  }

  async processPayment(
    amount: number,
    provider: PaymentProvider,
  ): Promise<string> {
    const strategy = this.paymentContext.getStrategy(provider);
    return strategy.execute(amount);
  }
}
