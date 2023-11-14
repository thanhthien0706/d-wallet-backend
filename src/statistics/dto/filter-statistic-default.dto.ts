import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class FilterStatisticDefaultDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsNumberString()
  year?: string;
}
