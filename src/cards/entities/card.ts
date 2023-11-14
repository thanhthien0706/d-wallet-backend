import { BaseEntity } from '@/common/base.entity';
import { TransactionEntity } from '@/transactions/entities/transaction';
import { AccountEntity } from '@/users/entities/accounts';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('cards')
export class CardEntity extends BaseEntity {
  @Expose()
  @Column()
  @ApiProperty()
  token: string;

  @Expose()
  @Column()
  @ApiProperty()
  brand: string;

  @Expose()
  @Column()
  @ApiProperty()
  country: string;

  @Expose()
  @Column()
  @ApiProperty()
  expMonth: string;

  @Expose()
  @Column()
  @ApiProperty()
  expYear: string;

  @Expose()
  @Column()
  @ApiProperty()
  codeLast4: string;

  @ManyToOne(() => AccountEntity, (account) => account.cards)
  account: AccountEntity;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.card)
  transactions: TransactionEntity[];
}
