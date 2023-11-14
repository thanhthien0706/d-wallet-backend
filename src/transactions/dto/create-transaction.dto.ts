import { BankAccountEntity } from '@/bank-accounts/entities/bank-account';
import { CardEntity } from '@/cards/entities/card';
import { LocalBankEntity } from '@/local-banks/entities/local-bank';
import { AccountEntity } from '@/users/entities/accounts';
import { StatusType } from '@enums/status';
import { TransactionType } from '@enums/transaction';
import { IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  amount: string;

  status: StatusType;

  typeTransaction: TransactionType;

  notes?: string;

  sender?: AccountEntity;

  receiver?: AccountEntity;

  bankAccount?: BankAccountEntity;

  card?: CardEntity;

  localBank?: LocalBankEntity;
}
