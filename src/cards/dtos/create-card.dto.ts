import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Matches,
} from 'class-validator';
import {
  CARD_NUMBER_PATTERN,
  CVC_NUMBER_PATTERN,
} from '@/common/regex-pattern';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(CARD_NUMBER_PATTERN)
  number: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  expMonth: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  expYear: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(CVC_NUMBER_PATTERN)
  cvc: string;
}
