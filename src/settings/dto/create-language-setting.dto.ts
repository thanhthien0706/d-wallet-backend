import { AccountEntity } from '@/users/entities/accounts';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class CreateLanguageSettingDto {
  @Exclude()
  account: AccountEntity;

  @ApiProperty()
  @Expose()
  languageKey: string;
}
