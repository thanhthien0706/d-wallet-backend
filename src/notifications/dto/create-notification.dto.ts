import { TransactionEntity } from '@/transactions/entities/transaction';
import { AccountEntity } from '@/users/entities/accounts';
import { NotificationType } from '@enums/notification';

export class CreateNotificationDto {
  type: NotificationType;

  account: AccountEntity;

  transaction?: TransactionEntity;
}
