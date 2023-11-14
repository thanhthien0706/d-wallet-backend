import { ApiProperty } from '@nestjs/swagger';
import { CreateWithdrawDto } from './create-withdraw.dto';
import { Expose } from 'class-transformer';
import { StatusType } from '@enums/status';
import { TransactionType } from '@enums/transaction';

export class ReturnWithdrawDto extends CreateWithdrawDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  status: StatusType;

  @ApiProperty()
  @Expose()
  typeTransaction: TransactionType.WITHDRAW;
}
