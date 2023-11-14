import { Expose, Type } from 'class-transformer';
import { ReturnAccountDto } from './return-account.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnAuthDto {
  @ApiProperty()
  @Expose()
  accessToken: string;

  @ApiProperty()
  @Expose()
  refreshToken: string;

  @ApiProperty({
    type: ReturnAccountDto,
  })
  @Expose()
  @Type(() => ReturnAccountDto)
  account: ReturnAccountDto;
}
