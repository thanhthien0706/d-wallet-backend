import { multiplyAmount } from '@/utils/amount-handle';
import { SETTING_DEFAULT } from '@constants/setting-default';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsDecimal,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';

export class QueryScanToTransferDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => (value !== null ? +value : null))
  @IsNumber()
  @IsPositive()
  @Min(1)
  amount?: number;
}
