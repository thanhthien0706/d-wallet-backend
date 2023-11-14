import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { StatisticTypeTransactionInterface } from '../interfaces/statistic-type-transaction.interface';
import { FilterStatisticType } from '@enums/type-filter-statistic';
import { StatisticTypeTransactionDto } from './statistic-type-transaction.dto';

export class ReturnStatisticTypeTransactionDto {
  @ApiProperty({
    type: StatisticTypeTransactionDto,
    isArray: true,
  })
  @Expose()
  data: StatisticTypeTransactionDto[];

  @ApiProperty({
    type: String,
    isArray: true,
  })
  @Expose()
  labels: string[];

  @ApiProperty({
    type: Number,
    isArray: true,
  })
  @Expose()
  percents: number[];

  @ApiProperty({
    type: Number,
    isArray: true,
  })
  @Expose()
  totalAmountWithTypeTransactions: number[];

  @ApiProperty({
    type: Number,
  })
  @Expose()
  totalAmount: number;

  @ApiProperty({
    enum: FilterStatisticType,
  })
  @Expose()
  type: FilterStatisticType;
}
