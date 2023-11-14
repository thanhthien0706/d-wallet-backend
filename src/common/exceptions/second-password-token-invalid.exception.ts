import { MessageError } from '@/message';
import { ForbiddenException } from '@nestjs/common';

export class SecondPasswordTokenInvalidException extends ForbiddenException {
  constructor() {
    super(MessageError.SECONDPASSWORD_TOKEN_INVALID());
  }
}
