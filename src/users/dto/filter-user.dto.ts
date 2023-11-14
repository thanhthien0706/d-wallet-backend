import { BaseFilterDto } from '@/common/base-filter.dto';
import { OrderType } from '@enums/order';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { AccountEntity } from '../entities/accounts';

class OrderDto {
  @ApiPropertyOptional({ enum: OrderType, name: 'order[name]' })
  @IsEnum(OrderType)
  name?: OrderType;

  @ApiPropertyOptional({ enum: OrderType, name: 'order[email]' })
  @IsEnum(OrderType)
  email?: OrderType;

  @ApiPropertyOptional({ enum: OrderType, name: 'order[phone]' })
  @IsEnum(OrderType)
  phone?: OrderType;

  @ApiPropertyOptional({ enum: OrderType, name: 'order[createdAt]' })
  @IsEnum(OrderType)
  createdAt?: OrderType;

  @ApiPropertyOptional({ enum: OrderType, name: 'order[updatedAt]' })
  @IsEnum(OrderType)
  updatedAt?: OrderType;
}

export class FilterUserDto extends BaseFilterDto<AccountEntity> {
  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  order?: OrderDto;
}
