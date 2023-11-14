import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokenVerificationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string;
}
