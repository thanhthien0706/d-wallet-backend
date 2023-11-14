import { TransactionType } from '@enums/transaction';

export interface StatisticTypeTransactionInterface {
  typeTransaction: TransactionType;
  percent: number;
  totalAmount: number;
}
