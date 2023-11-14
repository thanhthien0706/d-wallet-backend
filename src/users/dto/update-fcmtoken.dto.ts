import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFcmToken {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  notificationToken: string;
}
