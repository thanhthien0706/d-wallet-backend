import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReturnResetPasswordDto {
  @ApiProperty()
  @Expose()
  token: string;
}
