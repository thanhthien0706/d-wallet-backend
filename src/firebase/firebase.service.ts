import { ReturnNotificationDto } from '@/notifications/dto/return-notification.dto';
import { NotificationSettingService } from '@/settings/notification-setting.service';
import { TransactionEntity } from '@/transactions/entities/transaction';
import { AccountEntity } from '@/users/entities/accounts';
import { NotificationType } from '@enums/notification';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
const serviceAccount = require('./configs/napa-digital-wallet-adminsdk.json');

@Injectable()
export class FirebaseService {
  constructor(
    private readonly notificaitonSettingService: NotificationSettingService,
  ) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  async sendNotification(
    notification: ReturnNotificationDto,
    account: AccountEntity,
    transaction: TransactionEntity,
  ) {
    const notificaitonSettingCondition =
      await this.notificaitonSettingService.checkConditionToPushNoti(
        account,
        transaction,
      );
    if (!notificaitonSettingCondition) {
      return;
    }

    const message: Message = {
      notification: {
        title: notification.title,
        body: notification.content,
      },
      token: account.notificationToken,
    };

    const response = await admin.messaging().send(message);
    return response;
  }
}
