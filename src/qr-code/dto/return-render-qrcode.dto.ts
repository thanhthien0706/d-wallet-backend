import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReturnRenderQrcodeDto {
  @ApiProperty()
  @Expose()
  qrCodeImage: string;
}
