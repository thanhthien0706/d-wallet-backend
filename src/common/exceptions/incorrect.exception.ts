import { BadRequestException } from '@nestjs/common';
import { MessageError, MessageName } from '@/message';

export class IncorrectException extends BadRequestException {
  constructor(text: MessageName) {
    super(MessageError.INCORRECT(text));
  }
}
