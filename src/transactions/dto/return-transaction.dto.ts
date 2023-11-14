import { ReturnAccountDto } from '@/auth/dto/return-account.dto';
import { BankAccountEntity } from '@/bank-accounts/entities/bank-account';
import { CardEntity } from '@/cards/entities/card';
import { BaseEntity } from '@/common/base.entity';
import { LocalBankEntity } from '@/local-banks/entities/local-bank';
import { AccountEntity } from '@/users/entities/accounts';
import { StatusType } from '@enums/status';
import { TransactionType } from '@enums/transaction';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class ReturnTransactionDto extends BaseEntity {
  @ApiProperty()
  @Expose()
  amount: string | number;

  @ApiProperty()
  @Expose()
  status: StatusType;

  @ApiProperty()
  @Expose()
  typeTransaction: TransactionType;

  @ApiProperty()
  @Expose()
  notes: string;

  @ApiProperty()
  @Expose()
  sender: AccountEntity;

  @ApiProperty()
  @Expose()
  receiver: AccountEntity;

  @ApiProperty()
  @Expose()
  bankAccount: BankAccountEntity;

  @ApiProperty()
  @Expose()
  card: CardEntity;

  @ApiProperty()
  @Expose()
  localBank: LocalBankEntity;
}
