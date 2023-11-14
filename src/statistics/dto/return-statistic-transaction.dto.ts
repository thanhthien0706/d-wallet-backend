import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { FilterStatisticTransactionDto } from './filter-statistic-transaction.dto';
import { FilterStatisticType } from '@enums/type-filter-statistic';
import { IncomeExpenseInterface } from '../interfaces/income-expense.interface';

export class ReturnStatisticTransactionDto {
  @ApiProperty()
  @Expose()
  data: IncomeExpenseInterface[];

  @ApiProperty()
  @Expose()
  labels: string[] | number[];

  @ApiProperty()
  @Expose()
  incomes: number[];

  @ApiProperty()
  @Expose()
  expenses: number[];

  @ApiProperty({
    enum: FilterStatisticType,
  })
  @Expose()
  type: FilterStatisticType;

  @ApiProperty()
  @Expose()
  totalIncomes: number;

  @ApiProperty()
  @Expose()
  totalExpenses: number;
}
