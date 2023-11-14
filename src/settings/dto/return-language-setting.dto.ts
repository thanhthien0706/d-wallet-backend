import { ApiProperty } from '@nestjs/swagger';
import { CreateLanguageSettingDto } from './create-language-setting.dto';
import { Expose } from 'class-transformer';

export class ReturnLanguageSettingDto extends CreateLanguageSettingDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  accountId: number;
}
