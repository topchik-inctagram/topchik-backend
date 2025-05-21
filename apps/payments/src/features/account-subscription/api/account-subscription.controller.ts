import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { AccountSubscriptionQueryRepo } from './query.repos/account-subscription.query.repo';
import { AccountSubscriptionDto } from './dtos/account-subscription.dto';
import { IdParamDto } from '../../../../../common/dtos/id-param.dto';

@Controller('account-subscription')
export class AccountSubscriptionController {
  constructor(private accountQueryRepo: AccountSubscriptionQueryRepo) {}

  @Get('price-list')
  public async prices() {
    //todo insert in db data & return here
    return; //this.subscriptionsQueryRepository.getPriceList();
  }

  @Post(':id')
  @HttpCode(HttpStatus.CREATED)
  async createSubscription(
    @Param() { id }: IdParamDto,
    @Body() { userId, provider }: AccountSubscriptionDto,
  ) {
    //todo create payment/subscription & connect to provider
  }

  @Post('stripe-webhook')
  @HttpCode(HttpStatus.OK)
  async stripeWebhook(@Body() event: any) {
    console.log(event);
    // todo get answer from stripe
  }

  @Post('paypal-webhook')
  @HttpCode(HttpStatus.OK)
  async paypalWebhook(@Body() event: any) {
    console.log(event);
    // todo get answer from paypal
  }

  @Post('cancel')
  public async cancelSubscription() {
    //todo cancel subscription by userId
  }

  @Get('payments')
  public async getPayments() {
    //todo get all user payments
  }

  @Get('current')
  public async getCurrentSubscription() {
    //todo get current subscription by user
  }
}
