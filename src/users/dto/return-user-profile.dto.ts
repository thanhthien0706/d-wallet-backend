import { BaseEntity } from '@/common/base.entity';
import { GenderType } from '@enums/gender';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReturnUserProfileDto extends BaseEntity {
  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  avatar: string;

  @ApiProperty()
  @Expose()
  fullname: string;

  @ApiProperty({
    enum: GenderType,
  })
  @Expose()
  gender: GenderType;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  address: string;

  @ApiProperty()
  @Expose()
  dob: Date;
}
