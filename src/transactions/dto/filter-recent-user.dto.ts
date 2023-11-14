import { BaseFilterDto } from '@/common/base-filter.dto';
import { TransactionEntity } from '../entities/transaction';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { OrderType } from '@enums/order';

class OrderDto {
  @ApiPropertyOptional({ enum: OrderType, name: 'order[createdAt]' })
  @IsEnum(OrderType)
  createdAt?: OrderType;

  @ApiPropertyOptional({ enum: OrderType, name: 'order[updatedAt]' })
  @IsEnum(OrderType)
  updatedAt?: OrderType;
}

export class FilterRecentUsersDto extends BaseFilterDto<TransactionEntity> {
  @ApiPropertyOptional()
  @IsOptional()
  order?: OrderDto;

  senderId?: number;
}
