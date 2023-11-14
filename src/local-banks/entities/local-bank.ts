import { BaseEntity } from '@/common/base.entity';
import { TransactionEntity } from '@/transactions/entities/transaction';
import { AccountEntity } from '@/users/entities/accounts';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('local_banks')
export class LocalBankEntity extends BaseEntity {
  @Expose()
  @Column()
  @ApiProperty()
  accountNumber: string;

  @Expose()
  @Column()
  @ApiProperty()
  bankName: string;

  @Expose()
  @Column()
  @ApiProperty()
  bankCode: string;

  @Expose()
  @Column()
  @ApiProperty()
  bankUserName: string;

  @ManyToOne(() => AccountEntity, (account) => account.localBanks)
  account: AccountEntity;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.localBank)
  transactions: TransactionEntity[];
}
