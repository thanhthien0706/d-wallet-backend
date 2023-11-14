import { GenderType } from '@enums/gender';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';
import { AccountEntity } from '../entities/accounts';

export class CreateUserProfileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  avatar?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullname?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address?: string | null;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gender?: GenderType | null;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  dob?: Date;

  account?: AccountEntity;
}
