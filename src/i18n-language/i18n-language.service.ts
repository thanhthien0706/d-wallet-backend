import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ITypeMessageNotifiI18n } from './interfaces/type-i18n.interface';
import { SETTING_DEFAULT } from '@constants/setting-default';

@Injectable()
export class I18nLanguageService {
  constructor(private readonly i18n: I18nService) {}

  async getTitleContentI18n(
    {
      keyTitle,
      keyContent,
      optionsTitle,
      optionsContent,
    }: ITypeMessageNotifiI18n,
    lang: string = SETTING_DEFAULT.LANGUAGE.DEFAULT,
  ): Promise<string[]> {
    const titlePromise = this.i18n.t(keyTitle, {
      lang,
      ...optionsTitle,
    }) as string;
    const contentPromise = this.i18n.t(keyContent, {
      lang,
      ...optionsContent,
    }) as string;
    return await Promise.all([titlePromise, contentPromise]);
  }
}
