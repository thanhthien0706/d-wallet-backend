import { BaseEntity } from '@/common/base.entity';
import { IsEmail } from 'class-validator';
import {
  Column,
  Entity,
  Exclusion,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserProfilesEntity } from './user-profiles';
import { BankAccountEntity } from '@/bank-accounts/entities/bank-account';
import { CardEntity } from '@/cards/entities/card';
import { LocalBankEntity } from '@/local-banks/entities/local-bank';
import { TransactionEntity } from '@/transactions/entities/transaction';
import { BalanceHistoriesEntity } from '@/balance-histories/entities/balance-history';
import { Exclude, Expose } from 'class-transformer';
import { TypeAuth } from '@constants/type-auth';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationEntity } from '@/notifications/entities/notification';
import { ResetCodeEntity } from '@/reset-password-code/entity/reset-code.entity';

@Entity('accounts')
export class AccountEntity extends BaseEntity {
  @Expose()
  @Column()
  @IsEmail()
  @ApiProperty()
  email: string;

  @Expose()
  @Column()
  @ApiProperty()
  name: string;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @Exclude()
  @Column({ nullable: true })
  pin: string;

  @Exclude()
  @Column({ nullable: true })
  tokenStripe: string;

  @Column({ nullable: true })
  typeAuth: TypeAuth;

  @Exclude()
  @Column({ nullable: true })
  secretKey2fa: string;

  @Exclude()
  @Column({ nullable: true })
  refreshToken: string;

  @Exclude()
  @Column({ nullable: true })
  notificationToken: string;

  @Exclude()
  @Column({ nullable: true })
  secondPassword: string;

  compareSecondPassword(password: string) {
    return bcrypt.compareSync(password, this.secondPassword);
  }

  comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }

  @OneToOne(() => UserProfilesEntity, (profile) => profile.account)
  userProfile: UserProfilesEntity;

  @OneToMany(() => BankAccountEntity, (bankAccount) => bankAccount.account)
  bankAccounts: BankAccountEntity[];

  @OneToMany(() => CardEntity, (card) => card.account)
  cards: CardEntity[];

  @OneToMany(() => LocalBankEntity, (localBank) => localBank.account)
  localBanks: LocalBankEntity[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.sender)
  transactionSenders: TransactionEntity[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.receiver)
  transactionReceivers: TransactionEntity[];

  @OneToMany(() => BalanceHistoriesEntity, (transaction) => transaction.account)
  balanceHistories: BalanceHistoriesEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.account)
  notifications: NotificationEntity[];

  @OneToMany(() => ResetCodeEntity, (resetCode) => resetCode.account)
  resetCodes: ResetCodeEntity;
}
