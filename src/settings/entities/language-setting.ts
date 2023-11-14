import { BaseEntity } from '@/common/base.entity';
import { AccountEntity } from '@/users/entities/accounts';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';
// import { LanguagesEntity } from './languages';
import { language } from 'googleapis/build/src/apis/language';
import { SETTING_DEFAULT } from '@constants/setting-default';

@Entity('language_settings')
export class LanguageSettingEntity extends BaseEntity {
  @OneToOne(() => AccountEntity)
  @JoinColumn()
  account: AccountEntity;

  @Column({ default: SETTING_DEFAULT.LANGUAGE.DEFAULT })
  languageKey: string;

  // @ManyToOne(() => LanguagesEntity, (language) => language.languageSettings)
  // @JoinColumn()
  // language: LanguagesEntity;
}
