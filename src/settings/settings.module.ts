import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { LanguagesEntity } from './entities/languages';
import { LanguageSettingEntity } from './entities/language-setting';
import { NotificationEntity } from '@/notifications/entities/notification';
import { SecuritySettingEntity } from './entities/security-setting';
import { LanguageSettingService } from './language-setting.service';
import { NotificationSettingService } from './notification-setting.service';
import { NotificationSettingEntity } from './entities/notifications-setting';
import { SecuritySettingService } from './security-setting.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // LanguagesEntity,
      LanguageSettingEntity,
      NotificationEntity,
      SecuritySettingEntity,
      NotificationSettingEntity,
    ]),
  ],
  providers: [
    SettingsService,
    LanguageSettingService,
    NotificationSettingService,
    SecuritySettingService,
  ],
  controllers: [SettingsController],
  exports: [LanguageSettingService, NotificationSettingService],
})
export class SettingsModule {}
