import { ApiProperty } from '@nestjs/swagger';
import { ReturnLocalBankDto } from './return-local-bank.dto';
import { Expose, Type } from 'class-transformer';

export class ReturnPaginationLocalBankDto {
  @ApiProperty({
    type: [ReturnLocalBankDto],
  })
  @Expose()
  @Type(() => ReturnLocalBankDto)
  data: ReturnLocalBankDto;

  @ApiProperty()
  @Expose()
  total: number;
}
