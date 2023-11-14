import { TypeAuth } from '@constants/type-auth';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class CreateGoogleAccount {
  name: string;
  email: string;
  typeAuth: TypeAuth.GOOGLE;
}

export class CreateFacebookAccount {
  name: string;
  email: string;
  typeAuth: TypeAuth.FACEBOOK;
}
