import { Injectable } from '@nestjs/common';
import { INotificationStrategy } from './interface/notification-strategy.interface';
import { ReturnNotificationDto } from './dto/return-notification.dto';
import { TransactionEntity } from '@/transactions/entities/transaction';
import { IArgsNotifications } from './interface/args-notification.interface';

@Injectable()
export class NotificationContextService {
  private messageNotificationStrategy: INotificationStrategy;

  setMessageStrategy(messageStrategy: INotificationStrategy) {
    this.messageNotificationStrategy = messageStrategy;
  }

  async callMessageNotifiStrategy(
    returnNotification: ReturnNotificationDto,
    transaction: TransactionEntity,
    options?: IArgsNotifications,
  ) {
    return await this.messageNotificationStrategy.handleMessageNotification(
      returnNotification,
      transaction,
      options,
    );
  }
}
