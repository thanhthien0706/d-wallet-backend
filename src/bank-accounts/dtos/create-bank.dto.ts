import { AccountHolderType } from '@enums/account-holder-type';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateBankPaymentMethodDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accountHolderName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(AccountHolderType)
  accountHolderType: AccountHolderType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  routingNumber: string;
}
