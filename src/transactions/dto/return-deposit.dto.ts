import { StatusType } from '@enums/status';
import { TransactionType } from '@enums/transaction';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReturnDepositDto {
  @ApiProperty()
  @Expose()
  amount: string;

  @ApiProperty()
  @Expose()
  status: StatusType;

  @ApiProperty()
  @Expose()
  notes: string;

  @ApiProperty({
    example: 'DEPOSIT',
    enum: TransactionType,
  })
  @Expose()
  typeTransaction: TransactionType;
}
