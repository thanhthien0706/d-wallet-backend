import { PartialType } from '@nestjs/swagger';
import { CreateLanguageSettingDto } from './create-language-setting.dto';

export class UpdateLanguageSettingDto extends PartialType(
  CreateLanguageSettingDto,
) {}
