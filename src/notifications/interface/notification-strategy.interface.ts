import { TransactionEntity } from '@/transactions/entities/transaction';
import { ReturnNotificationDto } from '../dto/return-notification.dto';
import { IArgsNotifications } from './args-notification.interface';

export interface INotificationStrategy {
  handleMessageNotification(
    returnNotification: ReturnNotificationDto,
    transaction: TransactionEntity,
    options?: IArgsNotifications,
  ): Promise<ReturnNotificationDto>;
}
