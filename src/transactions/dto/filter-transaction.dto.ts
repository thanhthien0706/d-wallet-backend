import { BaseFilterDto } from '@/common/base-filter.dto';
import { TransactionEntity } from '../entities/transaction';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { OrderType } from '@enums/order';
import { StatusType } from '@enums/status';
import { TransactionType } from '@enums/transaction';
import { PaymentMethodType } from '@enums/payment-method';

class OrderDto {
  @ApiPropertyOptional({ enum: OrderType, name: 'order[amount]' })
  @IsEnum(OrderType)
  amount?: OrderType;

  @ApiPropertyOptional({ enum: OrderType, name: 'order[createdAt]' })
  @IsEnum(OrderType)
  createdAt?: OrderType;

  @ApiPropertyOptional({ enum: OrderType, name: 'order[updatedAt]' })
  @IsEnum(OrderType)
  updatedAt?: OrderType;
}

export class FilterTransactionDto extends BaseFilterDto<TransactionEntity> {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    type: Number,
    minimum: 0,
  })
  @IsOptional()
  startAmount?: number;

  @ApiPropertyOptional({
    type: Number,
    minimum: 0,
  })
  @IsOptional()
  endAmount?: number;

  @ApiPropertyOptional({
    enum: PaymentMethodType,
  })
  @IsOptional()
  @IsEnum(PaymentMethodType)
  typePayment?: PaymentMethodType;

  @ApiPropertyOptional({
    enum: StatusType,
  })
  @IsOptional()
  @IsEnum(StatusType)
  status?: StatusType;

  @ApiPropertyOptional({
    enum: TransactionType,
  })
  @IsOptional()
  @IsEnum(TransactionType)
  typeTransaction?: TransactionType;

  @ApiPropertyOptional()
  @IsOptional()
  @Expose()
  order?: OrderDto;

  senderId?: number;
}
