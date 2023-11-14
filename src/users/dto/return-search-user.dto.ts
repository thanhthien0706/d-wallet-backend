import { Expose, Type } from 'class-transformer';
import { ReturnUserProfileDto } from './return-user-profile.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ReturnSearchUserDto {
  @ApiProperty({
    type: [ReturnUserProfileDto],
  })
  @Expose()
  @Type(() => ReturnUserProfileDto)
  data: ReturnUserProfileDto[];

  @ApiProperty()
  @Expose()
  total: number;
}
