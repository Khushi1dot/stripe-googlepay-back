import {
  Controller,
  Post,
  Body,
  Headers,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';

@Controller()
export class StripeController {
  constructor(private readonly service: StripeService) {}

  @Post('payments/create-intent')
  async createIntent(@Body('amount') amount: number) {
    const intent = await this.service.createPaymentIntent(amount);
    return { clientSecret: intent.client_secret };
  }

  @Post('webhook')
  handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!req.rawBody) {
      throw new BadRequestException('Missing raw body');
    }

    const event = this.service.verifyWebhook(
      signature,
      req.rawBody, // ✅ guaranteed Buffer
    );

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object;
      console.log('Payment succeeded:', intent.id);
    }

    if (event.type === 'payment_intent.payment_failed') {
      console.log('Payment failed');
    }

    return { received: true };
  }
}
