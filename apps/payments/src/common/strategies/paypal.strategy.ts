import { Injectable } from '@nestjs/common';
import { PaymentStrategy } from './base-strategy.interface';
import paypal from '@paypal/checkout-server-sdk';
import { randomUUID } from 'crypto';

@Injectable()
export class PayPalStrategy implements PaymentStrategy {
  private paypal: paypal.core.PayPalHttpClient;

  constructor() {
    const environment = new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID, // Клиент ID
      process.env.PAYPAL_CLIENT_SECRET, // Клиент Secret
    );
    this.paypal = new paypal.core.PayPalHttpClient(environment);
  }

  async execute(amount: number): Promise<string> {
    console.log(`Processing payment through PayPal: $${amount}`);

    try {
      // Завтра в 00:00:00 (UTC)
      const tomorrowMidnight = new Date();
      tomorrowMidnight.setUTCDate(tomorrowMidnight.getUTCDate() + 1);
      tomorrowMidnight.setUTCHours(0, 0, 0, 0);

      // Создаем подписку через PayPal Subscriptions API
      const order = new paypal.orders.OrdersCreateRequest();

      // Динамически создаем подписку без создания планов
      order.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
          {
            description: 'Account Subscription',
            amount: {
              currency_code: 'USD',
              value: amount.toFixed(2), // Динамическая сумма
            },
            custom_id: randomUUID(), // Уникальный ID для подписки
          },
        ],
        application_context: {
          return_url: 'https://your-frontend.com/success', // URL для успешной оплаты
          cancel_url: 'https://your-frontend.com/cancel', // URL для отмены оплаты
        },
        metadata: {
          userId: '123', // Передаем ID пользователя в метаданных
          subscription_interval: interval, // Пример метаданных для подписки
        },
      });

      // Отправляем запрос на создание подписки
      const orderResponse = await this.paypal.execute(order);

      // Ищем ссылку на оплату
      const approvalUrl = orderResponse.result.links?.find(
        (link: { rel: string }) => link.rel === 'approve',
      )?.href;

      if (!approvalUrl) {
        throw new Error('Approval URL not found in PayPal response');
      }

      return approvalUrl; // Возвращаем URL для редиректа на страницу оплаты
    } catch (e) {
      console.error('Error creating PayPal subscription:', e);
      throw new Error('PayPal subscription creation failed');
    }
  }
}
