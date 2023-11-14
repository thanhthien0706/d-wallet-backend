import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class CreateNotificationSettingDto {
  @ApiProperty()
  @IsBoolean()
  @Expose()
  sendMoneyToSomeone: boolean;

  @ApiProperty()
  @IsBoolean()
  @Expose()
  receiveMoneyToSomeone: boolean;

  @ApiProperty()
  @IsBoolean()
  @Expose()
  receiveQR: boolean;

  @ApiProperty()
  @IsBoolean()
  @Expose()
  receiveSubscription: boolean;

  @ApiProperty()
  @IsBoolean()
  @Expose()
  receiveAnnouncementsOffers: boolean;

  @ApiProperty()
  @IsBoolean()
  @Expose()
  receiveUpdate: boolean;

  @ApiProperty()
  @IsBoolean()
  @Expose()
  depositToWallet: boolean;

  @ApiProperty()
  @IsBoolean()
  @Expose()
  withdrawFromWallet: boolean;
}
