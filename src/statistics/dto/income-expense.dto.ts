import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class IncomeExpenseDto {
  @ApiProperty()
  @Expose()
  label: number;

  @ApiProperty()
  @Expose()
  income: number;

  @ApiProperty()
  @Expose()
  expense: number;
}
