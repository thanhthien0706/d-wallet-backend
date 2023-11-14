import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsPositive,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateTransferDto {
  from?: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  to: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(1)
  amount: number;

  @ApiProperty()
  @IsString()
  notes: string;
}
