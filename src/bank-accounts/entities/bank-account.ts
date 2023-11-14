import { BaseEntity } from '@/common/base.entity';
import { TransactionEntity } from '@/transactions/entities/transaction';
import { AccountEntity } from '@/users/entities/accounts';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('bank_accounts')
export class BankAccountEntity extends BaseEntity {
  @Expose()
  @Column()
  @ApiProperty()
  token: string;

  @Expose()
  @Column()
  @ApiProperty()
  holderName: string;

  @Expose()
  @Column()
  @ApiProperty()
  holderType: string;

  @Expose()
  @Column()
  @ApiProperty()
  bankMame: string;

  @Expose()
  @Column()
  @ApiProperty()
  country: string;

  @Expose()
  @Column()
  @ApiProperty()
  currency: string;

  @Expose()
  @Column()
  @ApiProperty()
  codeLast4: string;

  @Expose()
  @Column()
  @ApiProperty()
  routingName: string;

  @ManyToOne(() => AccountEntity, (account) => account.bankAccounts)
  account: AccountEntity;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.bankAccount)
  transactions: TransactionEntity[];
}
