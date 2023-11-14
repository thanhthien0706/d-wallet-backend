import { BaseEntity } from '@/common/base.entity';
import { TransactionEntity } from '@/transactions/entities/transaction';
import { AccountEntity } from '@/users/entities/accounts';
import { NotificationType } from '@enums/notification';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('notifications')
export class NotificationEntity extends BaseEntity {
  @Column({
    default: false,
  })
  seenByUser: boolean;

  @Column()
  type: NotificationType;

  @ManyToOne(() => AccountEntity, (account) => account.notifications)
  @JoinColumn({ name: 'accountId' })
  account: AccountEntity;

  @ManyToOne(
    () => TransactionEntity,
    (transaction) => transaction.notifications,
    { nullable: true },
  )
  transaction?: TransactionEntity;
}
