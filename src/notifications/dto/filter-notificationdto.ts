import { BaseFilterDto } from '@/common/base-filter.dto';
import { OrderType } from '@enums/order';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { NotificationEntity } from '../entities/notification';
import { NotificationType } from '@enums/notification';

class OrderDto {
  @ApiPropertyOptional({ enum: OrderType, name: 'order[createdAt]' })
  @IsEnum(OrderType)
  createdAt?: OrderType;

  @ApiPropertyOptional({ enum: OrderType, name: 'order[updatedAt]' })
  @IsEnum(OrderType)
  updatedAt?: OrderType;
}

export class FilterNotificationDto extends BaseFilterDto<NotificationEntity> {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  seen?: boolean;

  @ApiPropertyOptional({ enum: NotificationType })
  @IsOptional()
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  order?: OrderDto;

  accountId?: number;

  language?: string;
}
