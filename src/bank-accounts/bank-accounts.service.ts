import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccountEntity } from './entities/bank-account';
import { StripeService } from '@/stripe/stripe.service';
import { CreateBankPaymentMethodDto } from './dtos/create-bank.dto';
import { AccountEntity } from '@/users/entities/accounts';

@Injectable()
export class BankAccountsService {
  constructor(
    @InjectRepository(BankAccountEntity)
    private bankAccountRepository: Repository<BankAccountEntity>,
    private stripeService: StripeService,
  ) {}

  async createBankPyamentMethod(
    createBankPaymentDto: CreateBankPaymentMethodDto,
    account: AccountEntity,
  ) {
    const { tokenStripe } = account;

    const paymentMethods = await this.stripeService.createBankPayment(
      createBankPaymentDto,
    );
    const attachPaymentToAccount =
      await this.stripeService.attachPaymentToAccount(
        paymentMethods,
        tokenStripe,
      );

    return this.bankAccountRepository.save({
      token: attachPaymentToAccount.id,
      holderName: createBankPaymentDto.accountHolderName,
      holderType: attachPaymentToAccount.us_bank_account.account_holder_type,
      bankName: attachPaymentToAccount.us_bank_account.bank_name,
      currency: createBankPaymentDto.currency,
      country: createBankPaymentDto.country,
      codeLast4: attachPaymentToAccount.us_bank_account.last4,
      account,
    });
  }
}
