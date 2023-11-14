import { ApiProperty } from '@nestjs/swagger';
import { ReturnCardDto } from './return-card.dto';
import { Expose, Type } from 'class-transformer';

export class ReturnPaginationCardDto {
  @ApiProperty({
    type: [ReturnCardDto],
  })
  @Expose()
  @Type(() => ReturnCardDto)
  data: ReturnCardDto[];

  @ApiProperty()
  @Expose()
  total: number;
}
