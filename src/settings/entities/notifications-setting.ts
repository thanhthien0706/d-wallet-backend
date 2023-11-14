import { BaseEntity } from '@/common/base.entity';
import { AccountEntity } from '@/users/entities/accounts';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('notifications_settings')
export class NotificationSettingEntity extends BaseEntity {
  @OneToOne(() => AccountEntity)
  @JoinColumn()
  account: AccountEntity;

  @Column({ default: false })
  sendMoneyToSomeone: boolean;

  @Column({ default: false })
  receiveMoneyToSomeone: boolean;

  @Column({ default: false })
  receiveQR: boolean;

  @Column({ default: false })
  receiveSubscription: boolean;

  @Column({ default: false })
  receiveAnnouncementsOffers: boolean;

  @Column({ default: false })
  receiveUpdate: boolean;

  @Column({ default: false })
  depositToWallet: boolean;

  @Column({ default: false })
  withdrawFromWallet: boolean;
}
