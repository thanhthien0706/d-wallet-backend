import { StatusType } from '@enums/status';
import { TransactionType } from '@enums/transaction';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReturnTransferDto {
  @ApiProperty()
  @Expose()
  from: number;

  @ApiProperty()
  @Expose()
  to: number;

  @ApiProperty()
  @Expose()
  amount: string;

  @ApiProperty()
  @Expose()
  notes: string;

  @Expose()
  @ApiProperty({
    enum: StatusType,
  })
  status: StatusType;

  @ApiProperty({
    example: 'TRANSFER',
    enum: TransactionType,
  })
  @Expose()
  typeTransaction: TransactionType;
}
