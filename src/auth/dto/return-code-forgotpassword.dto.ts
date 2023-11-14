import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReturnCodeForgotPassword {
  @ApiProperty()
  @Expose()
  token: string;

  @ApiProperty()
  @Expose()
  code: number;
}
