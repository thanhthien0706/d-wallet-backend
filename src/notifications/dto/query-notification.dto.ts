import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNumber, IsNumberString, IsOptional } from 'class-validator';

export class QueryNotificationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  idNotification?: number;
}
