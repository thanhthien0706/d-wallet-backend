import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWithdrawDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  localBankId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  amount: string;

  @ApiPropertyOptional()
  @IsString()
  @Expose()
  notes?: string;
}
