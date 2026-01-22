// import { Injectable } from '@nestjs/common';
// import Stripe from 'stripe';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class StripeService {
//   private stripe: Stripe;

//   constructor(private configService: ConfigService) {
//     this.stripe = new Stripe(
//       this.configService.get<string>('STRIPE_SECRET_KEY')!,
//     );
//   }

//   async createPaymentIntent(amount: number) {
//     return this.stripe.paymentIntents.create({
//       amount,
//       currency: 'usd',
//     //   payment_method_types: ['card'],
//       automatic_payment_methods: {
//         enabled: true, // Required for Google Pay
//       },
//     });
//   }
// }

import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  // constructor() {
  //   this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  //     apiVersion: '2023-10-16',
  //   });
  // }
  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY')!,
      {
    apiVersion: '2024-12-18',
  },
    );
  }

  createPaymentIntent(amount: number) {
    return this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      //  payment_method_types: ['card'],
      automatic_payment_methods: {
        enabled: true,
      },
      
    });
  }

  verifyWebhook(signature: string, body: Buffer) {
    return this.stripe.webhooks.constructEvent(
      body,
      signature,
    
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET')!,
    
    );
  }
}
