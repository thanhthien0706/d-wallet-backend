import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { NotificationSettingService } from './notification-setting.service';
import { Auth } from '@decorators/auth.decorator';
import { CreateNotificationSettingDto } from './dto/create-notification-setting.dto';
import { Serialize } from '@decorators/Serialize.decorator';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UpdateNotificationSettingDto } from './dto/update-notification-setting.dto';
import { ReturnNotificationSettingDto } from './dto/return-notification-setting.dto';
import { User } from '@decorators/user.decorator';
import { UserInforValidate } from '@/users/dto/user-infor-validate.dto';
import { LanguageSettingService } from './language-setting.service';
import { ReturnLanguageSettingDto } from './dto/return-language-setting.dto';
import { SecuritySettingService } from './security-setting.service';
import { ReturnSecuritySettingDto } from './dto/return-security-setting.dto';
import { UpdateSecuritySettingDto } from './dto/update-security-setting.dto';

@ApiTags('settings')
@Controller('settings')
@ApiBearerAuth()
@Auth()
export class SettingsController {
  constructor(
    private readonly notificationSettingService: NotificationSettingService,
    private readonly languageSettingService: LanguageSettingService,
    private readonly securitySettingService: SecuritySettingService,
  ) {}

  @ApiOkResponse({
    description: 'Create notification setting',
    type: ReturnNotificationSettingDto,
  })
  @Serialize(ReturnNotificationSettingDto)
  @Post('/notifications')
  async createNotificationSetting(
    @Body() createNotificationSettingDto: CreateNotificationSettingDto,
  ) {
    return this.notificationSettingService.create(createNotificationSettingDto);
  }

  @ApiOkResponse({
    description: 'Update notification setting',
    type: ReturnNotificationSettingDto,
  })
  @Serialize(ReturnNotificationSettingDto)
  @Patch('/notifications/:id')
  async updateNotificationSetting(
    @Param('id') notificationSettingId: number,
    @Body() updateNotificationSettingDto: UpdateNotificationSettingDto,
  ) {
    return this.notificationSettingService.update(
      notificationSettingId,
      updateNotificationSettingDto,
    );
  }

  @Auth()
  @Get('languages')
  getDefaultLanguage(@User() account: UserInforValidate) {
    return this.languageSettingService.getLanguageCode(account.id);
  }

  @Auth()
  @Patch('languages/user')
  @ApiOkResponse({
    description: 'Api update language setting',
    type: ReturnLanguageSettingDto,
  })
  @Serialize(ReturnLanguageSettingDto)
  updateLanguageSetting(
    @Query('language-key') languageKey: string,
    @User() account: UserInforValidate,
  ) {
    return this.languageSettingService.handleUpdateLanguageSetting(
      account,
      languageKey,
    );
  }

  @Auth()
  @Get('security')
  @ApiOkResponse({
    description: 'Api get security setting',
    type: ReturnSecuritySettingDto,
  })
  @Serialize(ReturnSecuritySettingDto)
  getDefaultSecurity(@User() account: UserInforValidate) {
    return this.securitySettingService.getSecuritySetting(account);
  }

  @Auth()
  @Patch('security/:id')
  @ApiOkResponse({
    description: 'Api update security setting',
    type: ReturnSecuritySettingDto,
  })
  @Serialize(ReturnSecuritySettingDto)
  updateSecuritySetting(
    @User() account: UserInforValidate,
    @Param('id') id: number,
    @Body() updateSecuritySettingDto: UpdateSecuritySettingDto,
  ) {
    return this.securitySettingService.update(id, updateSecuritySettingDto);
  }
}
