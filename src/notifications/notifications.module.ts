import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification';
import { NotificationsController } from './notifications.controller';
import { I18nLanguageModule } from '@/i18n-language/i18n-language.module';
import { DepositNotificationStrategy } from './stratery/deposit-notification.strategy';
import { TransactionNotificationStrategy } from './stratery/transaction-notification.strategy';
import { WithdrawNotificationStrategy } from './stratery/withdraw-notification.strategy';
import { NotificationContextService } from './notification-context.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity]), I18nLanguageModule],
  providers: [
    NotificationsService,
    DepositNotificationStrategy,
    TransactionNotificationStrategy,
    WithdrawNotificationStrategy,
    NotificationContextService,
  ],
  controllers: [NotificationsController],
  exports: [
    NotificationsService,
    DepositNotificationStrategy,
    TransactionNotificationStrategy,
    WithdrawNotificationStrategy,
    NotificationContextService,
  ],
})
export class NotificationsModule {}
