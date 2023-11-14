import { BadRequestException } from '@nestjs/common';
import { MessageError, MessageName } from '@/message';

export class ExistsException extends BadRequestException {
  constructor(text: MessageName) {
    super(MessageError.EXISTS(text));
  }
}
