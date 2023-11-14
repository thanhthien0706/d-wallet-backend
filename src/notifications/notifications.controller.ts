import {
  Controller,
  Delete,
  Get,
  ParseBoolPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import {
  ApiBearerAuth,
  ApiPropertyOptional,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '@decorators/auth.decorator';
import { User } from '@decorators/user.decorator';
import { FilterNotificationDto } from './dto/filter-notificationdto';
import { ReturnPagiNotifiDto } from './dto/return-notification.dto';
import { Serialize } from '@decorators/Serialize.decorator';
import { UserInforValidate } from '@/users/dto/user-infor-validate.dto';
import { QueryNotificationDto } from './dto/query-notification.dto';

// @ApiBearerAuth()
@ApiBearerAuth()
@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Auth()
  @Delete()
  deleteNotifications(
    @User() account: UserInforValidate,
    @Query() { idNotification }: QueryNotificationDto,
  ) {
    return this.notificationsService.handleDeleteNotification(
      idNotification,
      account.id,
    );
  }

  @Auth()
  @Post()
  updateReaded(
    @User() account: UserInforValidate,
    @Query() { idNotification }: QueryNotificationDto,
  ) {
    return this.notificationsService.handleReadedNotification(
      idNotification,
      account.id,
    );
  }

  @Auth()
  @Get()
  @Serialize(ReturnPagiNotifiDto)
  @ApiResponse({
    type: ReturnPagiNotifiDto,
  })
  getAllNotification(
    @Query() filterNotifiDto: FilterNotificationDto,
    @User() account: UserInforValidate,
  ) {
    filterNotifiDto.accountId = account.id;
    filterNotifiDto.language = account.language;
    return this.notificationsService.findAllHandle(filterNotifiDto);
  }
}
