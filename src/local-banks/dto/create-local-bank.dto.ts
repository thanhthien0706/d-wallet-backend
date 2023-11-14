import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLocalBankDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  bankCode: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  bankName: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  bankUserName: string;
}
