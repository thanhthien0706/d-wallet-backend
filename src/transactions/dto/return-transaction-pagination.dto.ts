import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ReturnTransactionDto } from './return-transaction.dto';

export class ReturnTransactionPaginationDto {
  @ApiProperty({
    type: [ReturnTransactionDto],
  })
  @Expose()
  @Type(() => ReturnTransactionDto)
  data: ReturnTransactionDto[];

  @ApiProperty()
  @Expose()
  total: number;
}
