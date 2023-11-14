// import { BaseEntity } from '@/common/base.entity';
// import { Column, Entity, OneToMany } from 'typeorm';
// import { LanguageSettingEntity } from './language-setting';

// @Entity('languages')
// export class LanguagesEntity extends BaseEntity {
//   @Column()
//   isSugget: boolean;

//   @Column()
//   code: string;

//   @Column()
//   name: string;

//   @OneToMany(
//     () => LanguageSettingEntity,
//     (languageSetting) => languageSetting.language,
//   )
//   languageSettings: LanguageSettingEntity;
// }
