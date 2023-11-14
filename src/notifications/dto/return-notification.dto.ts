import { BaseEntity } from '@/common/base.entity';
import { TransactionEntity } from '@/transactions/entities/transaction';
import { NotificationType } from '@enums/notification';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

export class ReturnNotificationDto extends BaseEntity {
  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  seenByUser: boolean;

  @ApiProperty()
  @Expose()
  type: NotificationType;

  @ApiProperty()
  @Expose()
  transactionId: number;
}

export class ReturnPagiNotifiDto {
  @ApiProperty({
    type: [ReturnNotificationDto],
  })
  @Expose()
  @Type(() => ReturnNotificationDto)
  data: ReturnNotificationDto[];

  @ApiProperty()
  @Expose()
  total: number;
}
