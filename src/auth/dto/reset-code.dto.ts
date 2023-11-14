import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetCodeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  resetCode: string;
}
