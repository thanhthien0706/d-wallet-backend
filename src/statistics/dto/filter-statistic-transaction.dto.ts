import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FilterStatisticDefaultDto } from './filter-statistic-default.dto';
import { IsDate, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { FilterStatisticType } from '@enums/type-filter-statistic';

export class FilterStatisticTransactionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ enum: FilterStatisticType })
  @IsEnum(FilterStatisticType)
  type: FilterStatisticType;
}
