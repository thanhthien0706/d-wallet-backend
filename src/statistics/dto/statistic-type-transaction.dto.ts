import { TransactionType } from '@enums/transaction';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class StatisticTypeTransactionDto {
  @ApiProperty()
  @Expose()
  typeTransaction: TransactionType;

  @ApiProperty()
  @Expose()
  percent: number;

  @ApiProperty()
  @Expose()
  totalAmount: number;
}
