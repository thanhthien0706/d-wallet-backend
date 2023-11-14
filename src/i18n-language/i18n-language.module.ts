import { Module } from '@nestjs/common';
import { I18nLanguageService } from './i18n-language.service';

@Module({
  providers: [I18nLanguageService],
  exports: [I18nLanguageService],
})
export class I18nLanguageModule {}
