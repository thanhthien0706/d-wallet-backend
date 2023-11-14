import { AccountEntity } from '@/users/entities/accounts';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class CreateSecuritySettingDto {
  @Exclude()
  account?: AccountEntity;

  @ApiProperty()
  @Expose()
  is2FA: boolean;
}
