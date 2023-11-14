import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReturnStatisticDefault {
  @ApiProperty()
  @Expose()
  year: string;

  @ApiProperty()
  @Expose()
  average: number;

  @ApiProperty()
  @Expose()
  totalTransaction: number;

  @ApiProperty()
  @Expose()
  highestAmount: number;

  @ApiProperty()
  @Expose()
  dateHighestAmount: Date;

  @ApiProperty()
  @Expose()
  lowestAmount: number;

  @ApiProperty()
  @Expose()
  dateLowestAmount: Date;
}
