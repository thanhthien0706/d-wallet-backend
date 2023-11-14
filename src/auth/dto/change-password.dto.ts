import {
  CONTAIN_DIGIT,
  CONTAIN_LOWER_CASE,
  CONTAIN_UPPER_CASE,
  PASSWORD_CONTAIN_SPECIAL_CHARACTER,
  PASSWORD_NOT_CONTAIN_VIETNAMESE,
} from '@/common/regex-pattern';
import { SETTING_DEFAULT } from '@constants/setting-default';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(SETTING_DEFAULT.SECURITY.PASSWORD.MIN_LENGTH_DEFAULT)
  @Transform(({ value }: TransformFnParams) => value?.replace(/\s/g, ''))
  @Matches(PASSWORD_NOT_CONTAIN_VIETNAMESE, {
    message: 'Password must not contain Vietnamese characters',
  })
  @Matches(PASSWORD_CONTAIN_SPECIAL_CHARACTER, {
    message: 'At least one special character',
  })
  @Matches(CONTAIN_UPPER_CASE, { message: 'At least one upper case' })
  @Matches(CONTAIN_LOWER_CASE, { message: 'At least one lower case' })
  @Matches(CONTAIN_DIGIT, { message: 'At least one digit' })
  password: string;
}
