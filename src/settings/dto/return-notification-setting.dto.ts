import { ApiProperty } from '@nestjs/swagger';
import { CreateNotificationSettingDto } from './create-notification-setting.dto';
import { Expose } from 'class-transformer';

export class ReturnNotificationSettingDto extends CreateNotificationSettingDto {
  @ApiProperty()
  @Expose()
  id: number;
}
