import {
  Injectable,
  InternalServerErrorException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateCustomerDto } from './dto/create-customer.dto';
import Stripe from 'stripe';
import { STRIPE_TYPE } from '@constants/stripe.type';
import { IncorrectException } from '@exceptions/incorrect.exception';
import { MessageName } from '@/message';
import { CreateCardDto } from '@/cards/dtos/create-card.dto';
import { CreateBankPaymentMethodDto } from '@/bank-accounts/dtos/create-bank.dto';
import { PaymentMethodType } from '@enums/payment-method';
import { TransactionsService } from '@/transactions/transactions.service';
import { STRIPE_WEBHOOK_SECRET } from '@environments';
import { WebhookStripeEventException } from '@exceptions/webhook-stripe-event.exception';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionService: TransactionsService,
  ) {
    this.stripe = new Stripe(
      this.configService.get(STRIPE_TYPE.STRIPE_SECRET_KEY),
      {
        apiVersion: '2022-11-15',
      },
    );
  }

  async createrCustomer(createCustomerDto: CreateCustomerDto) {
    const customerStripe = await this.stripe.customers.create(
      createCustomerDto,
    );
    if (!customerStripe) {
      throw new IncorrectException(MessageName.USER);
    }
    return customerStripe;
  }

  async createCardPayment(createCardDto: CreateCardDto) {
    const { cvc, expMonth, expYear, number } = createCardDto;

    const cardPayment = await this.stripe.paymentMethods.create({
      type: PaymentMethodType.CARD,
      card: {
        number,
        exp_month: +expMonth,
        exp_year: +expYear,
        cvc,
      },
    });

    if (!cardPayment) {
      throw new IncorrectException(MessageName.USER);
    }

    return cardPayment;
  }

  async createBankPayment(createBankPaymentDto: CreateBankPaymentMethodDto) {
    const {
      accountHolderName,
      accountHolderType,
      accountNumber,
      routingNumber,
    } = createBankPaymentDto;

    const bankPayment = await this.stripe.paymentMethods.create({
      type: PaymentMethodType.US_BANK,
      us_bank_account: {
        account_holder_type: accountHolderType,
        account_number: accountNumber,
        routing_number: routingNumber,
      },
      billing_details: {
        name: accountHolderName,
      },
    });

    if (!bankPayment) {
      throw new IncorrectException(MessageName.USER);
    }

    return bankPayment;
  }

  async attachPaymentToAccount(
    paymentSource: Stripe.PaymentMethod,
    customerToken: string,
  ) {
    const attachPaymentToAcc = this.stripe.paymentMethods.attach(
      paymentSource.id,
      {
        customer: customerToken,
      },
    );

    if (!attachPaymentToAcc) {
      throw new InternalServerErrorException();
    }

    return attachPaymentToAcc;
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    paymentMethodToken: string,
    custometToken: string,
    transactionId: number,
  ) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount,
      currency,
      customer: custometToken,
      payment_method: paymentMethodToken,
      confirm: true,
      metadata: {
        transactionId: transactionId.toString(),
      },
    });

    return paymentIntent;
  }

  async getPaymentIntent(id: string) {
    return this.stripe.paymentIntents.retrieve(id);
  }

  async handlePaymentIntentSuccess(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    const { transactionId } = paymentIntent.metadata;
    return this.transactionService.handleDepositComplete(
      parseInt(transactionId),
    );
  }

  async handlePaymentIntentFail(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    const { transactionId } = paymentIntent.metadata;
    return this.transactionService.handleDepositFail(parseInt(transactionId));
  }

  constructEvent(stripeSignature: string | string[], payload: string) {
    let event: any;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        stripeSignature,
        STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      throw new WebhookStripeEventException(
        `⚠️ Webhook signature verification failed.`,
      );
    }

    return event;
  }

  /**
   * TODO:
   * This function need to handle send money from stripe to bank account
   * for customer withdraw
   */
  sendAmountFromStripeToBankAccount() {}
}
