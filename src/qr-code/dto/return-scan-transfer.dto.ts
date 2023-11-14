import { ReturnUserProfileDto } from '@/users/dto/return-user-profile.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class ReturnScanTransferDto {
  @ApiProperty({
    type: ReturnUserProfileDto,
  })
  @Expose()
  @Type(() => ReturnUserProfileDto)
  user: ReturnUserProfileDto;

  @ApiProperty()
  @Expose()
  amount: number;

  @ApiProperty()
  @Expose()
  notes: string;
}
