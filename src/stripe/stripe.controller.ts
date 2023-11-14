import { Controller, Post, Req, RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import { WebhookEventStripe } from '@constants/webhook-event-stripe';

@Controller('webhook')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
  ): Promise<void> {
    const handleWebhookEvent = {
      [WebhookEventStripe.PAYMENTSUCCEEDED]: async (id: string) => {
        const paymentIntent: Stripe.PaymentIntent =
          await this.stripeService.getPaymentIntent(id);
        await this.stripeService.handlePaymentIntentSuccess(paymentIntent);
      },
      [WebhookEventStripe.PAYMENTCANCELED]: async (id: string) => {
        const paymentIntent: Stripe.PaymentIntent =
          await this.stripeService.getPaymentIntent(id);
        await this.stripeService.handlePaymentIntentFail(paymentIntent);
      },
    };

    let sig: string | string[] = req.headers['stripe-signature'];

    const rawBody = req.rawBody;

    const event: Stripe.Event = this.stripeService.constructEvent(
      sig,
      rawBody.toString(),
    );

    const { id } = event.data.object as Stripe.PaymentIntent;
    const eventHandle = handleWebhookEvent[event.type];
    if (eventHandle) {
      await eventHandle(id);
    }
  }
}
