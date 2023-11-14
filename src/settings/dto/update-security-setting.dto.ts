import { PartialType } from '@nestjs/swagger';
import { CreateSecuritySettingDto } from './create-security-setting.dto';

export class UpdateSecuritySettingDto extends PartialType(
  CreateSecuritySettingDto,
) {}
