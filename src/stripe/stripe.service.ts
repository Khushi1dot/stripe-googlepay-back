// import { Injectable } from '@nestjs/common';
// import Stripe from 'stripe';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class StripeService {
//   private stripe: Stripe;

//   constructor(private configService: ConfigService) {
//     this.stripe = new Stripe(
//       this.configService.get<string>('STRIPE_SECRET_KEY')!,
//       {
//     // apiVersion: "2025-12-15.clover",
//   },
//     );
//   }

//   createPaymentIntent(amount: number) {
//     return this.stripe.paymentIntents.create({
//       amount,
//       currency: 'usd',
//       // payment_method_types: ['card', 'google_pay', 'apple_pay']
//       automatic_payment_methods: {
//         enabled: true,
//       },
      
//     });
//   }

//   verifyWebhook(signature: string, body: Buffer) {
//     return this.stripe.webhooks.constructEvent(
//       body,
//       signature,
    
//       this.configService.get<string>('STRIPE_WEBHOOK_SECRET')!,
    
//     );
//   }
// }
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY')!,
     
    );
  }

  createPaymentIntent(amount: number) {
    return this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      // automatic_payment_methods: {  // ← USE THIS with v20
      //   enabled: true,
      //   allow_redirects: 'never', // Keeps only wallets + cards
      // },
      payment_method_types: ['card', 'google_pay', 'apple_pay'],
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