export interface PaymentStrategy {
  execute(amount: number): Promise<string>;
}
