import { BalanceHistoriesEntity } from '@/balance-histories/entities/balance-history';
import { BankAccountEntity } from '@/bank-accounts/entities/bank-account';
import { CardEntity } from '@/cards/entities/card';
import { BaseEntity } from '@/common/base.entity';
import { LocalBankEntity } from '@/local-banks/entities/local-bank';
import { NotificationEntity } from '@/notifications/entities/notification';
import { AccountEntity } from '@/users/entities/accounts';
import { StatusType } from '@enums/status';
import { TransactionType } from '@enums/transaction';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('transactions')
export class TransactionEntity extends BaseEntity {
  @Column({
    type: String,
  })
  amount: string | number;

  @Column()
  status: StatusType;

  @Column()
  typeTransaction: TransactionType;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => AccountEntity, (account) => account.transactionSenders)
  sender: AccountEntity;

  @ManyToOne(() => AccountEntity, (account) => account.transactionReceivers, {
    nullable: true,
  })
  receiver: AccountEntity;

  @ManyToOne(() => BankAccountEntity, (bank) => bank.transactions, {
    nullable: true,
  })
  bankAccount: BankAccountEntity;

  @ManyToOne(() => CardEntity, (card) => card.transactions, { nullable: true })
  card: CardEntity;

  @ManyToOne(() => LocalBankEntity, (local_bank) => local_bank.transactions, {
    nullable: true,
  })
  localBank: LocalBankEntity;

  @OneToMany(
    () => BalanceHistoriesEntity,
    (transaction) => transaction.transaction,
  )
  balanceHistories: BalanceHistoriesEntity[];

  @OneToMany(
    () => NotificationEntity,
    (notification) => notification.transaction,
  )
  notifications: NotificationEntity[];
}
