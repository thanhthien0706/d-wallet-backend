import { BaseEntity } from '@/common/base.entity';
import { AccountEntity } from '@/users/entities/accounts';
import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';

@Entity('reset_codes')
export class ResetCodeEntity extends BaseEntity {
  @Column()
  code: string;

  @ManyToOne(() => AccountEntity, (account) => account.resetCodes)
  account: AccountEntity;
}
