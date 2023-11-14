import { BaseEntity } from '@/common/base.entity';
import { GenderType } from '@enums/gender';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AccountEntity } from './accounts';

@Entity('user_profiles')
export class UserProfilesEntity extends BaseEntity {
  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  fullname: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  gender: GenderType;

  @Column({ nullable: true })
  dob: Date;

  @OneToOne(() => AccountEntity, (account) => account.userProfile)
  @JoinColumn()
  account: AccountEntity;
}
