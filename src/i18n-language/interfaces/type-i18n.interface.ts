import { TranslateOptions } from 'nestjs-i18n';

export interface ITypeMessageNotifiI18n {
  keyTitle: string;
  keyContent: string;
  optionsTitle?: TranslateOptions;
  optionsContent?: TranslateOptions;
}
