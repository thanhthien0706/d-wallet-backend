import { BaseEntity } from '@/common/base.entity';
import { AccountEntity } from '@/users/entities/accounts';
import { SETTING_DEFAULT } from '@constants/setting-default';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('security_settings')
export class SecuritySettingEntity extends BaseEntity {
  @OneToOne(() => AccountEntity)
  @JoinColumn()
  account: AccountEntity;

  @Column({ default: false })
  is2FA: boolean;
}
