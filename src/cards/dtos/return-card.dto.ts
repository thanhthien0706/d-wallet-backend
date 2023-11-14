import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReturnCardDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  expYear: string;

  @ApiProperty()
  @Expose()
  expMonth: string;

  @ApiProperty()
  @Expose()
  codeLast4: string;

  @ApiProperty()
  @Expose()
  country: string;

  @ApiProperty()
  @Expose()
  brand: string;
}
