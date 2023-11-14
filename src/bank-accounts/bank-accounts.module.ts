import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountEntity } from './entities/bank-account';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountsService } from './bank-accounts.service';
import { StripeService } from '@/stripe/stripe.service';
import { StripeModule } from '@/stripe/stripe.module';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccountEntity]), StripeModule],
  controllers: [BankAccountsController],
  providers: [BankAccountsService],
  exports: [BankAccountsService],
})
export class BankAccountsModule {}
