import { Injectable } from '@nestjs/common';
import { PaymentStrategy } from './base-strategy.interface';
import Stripe from 'stripe';

@Injectable()
export class StripeStrategy implements PaymentStrategy {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe('YOUR_SECRET_KEY', {
      apiVersion: '2024-11-20.acacia',
    });
  }

  async execute(amount: number): Promise<string> {
    console.log(`Processing payment through Stripe`);
    try {
      // Вычисляем завтрашнюю дату в 00:00:00 (UTC)
      const tomorrowMidnight = new Date();
      tomorrowMidnight.setUTCDate(tomorrowMidnight.getUTCDate() + 1); // Завтра
      tomorrowMidnight.setUTCHours(0, 0, 0, 0); // 00:00:00

      const trialEndTimestamp = Math.floor(tomorrowMidnight.getTime() / 1000);

      // Создание сессии для Stripe Checkout
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'], // Методы оплаты
        mode: 'subscription', // Режим подписки
        line_items: [
          {
            price_data: {
              product_data: {
                name: 'Account Subscription', // Динамическое имя для подписки
              },
              unit_amount: amount * 100, // Цена за единицу
              currency: 'usd',
              recurring: {
                interval: 'day', // Длительность интервала подписки
              },
            },
            quantity: 1,
          },
        ],
        subscription_data: {
          trial_end: trialEndTimestamp, // Начало регулярного биллинга завтра в 00:00:00
        },
        success_url: '', // URL после успешной оплаты
        cancel_url: '', // URL после отмены оплаты
        metadata: {
          userId: '12345',
        },
      });

      return session.url; // URL для редиректа на страницу оплаты
    } catch (e: unknown) {
      console.log('Error in payment through Stripe');
    }
  }
}
