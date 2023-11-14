import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SecondPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  secondPassword: string;
}
