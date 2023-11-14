import { ApiProperty } from '@nestjs/swagger';
import { CreateSecuritySettingDto } from './create-security-setting.dto';
import { Expose } from 'class-transformer';

export class ReturnSecuritySettingDto extends CreateSecuritySettingDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  accountId: number;
}
