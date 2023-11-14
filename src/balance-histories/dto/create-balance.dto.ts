import { TransactionEntity } from '@/transactions/entities/transaction';
import { AccountEntity } from '@/users/entities/accounts';
import { StatusType } from '@enums/status';
import { IsString } from 'class-validator';

export class CreateBalanceDto {
  @IsString()
  value: string;

  status: StatusType;

  account: AccountEntity;

  transaction?: TransactionEntity;
}
