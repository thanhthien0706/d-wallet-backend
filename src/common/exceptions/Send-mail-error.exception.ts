import { MessageError } from '@/message';
import { InternalServerErrorException } from '@nestjs/common';

export class SendMailErrorException extends InternalServerErrorException {
  constructor() {
    super(MessageError.SEND_MAIL_ERROR());
  }
}
