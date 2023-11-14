import { MessageError } from '@/message';
import { ConflictException } from '@nestjs/common';

export class GetBalanceErrorException extends ConflictException {
  constructor() {
    super(MessageError.GET_BALANCE_ERROR());
  }
}
