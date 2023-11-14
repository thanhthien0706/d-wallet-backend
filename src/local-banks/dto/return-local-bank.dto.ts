import { ApiProperty } from '@nestjs/swagger';
import { CreateLocalBankDto } from './create-local-bank.dto';
import { Expose } from 'class-transformer';

export class ReturnLocalBankDto extends CreateLocalBankDto {
  @ApiProperty()
  @Expose()
  id: number;
}
