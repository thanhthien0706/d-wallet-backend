import { BadRequestException } from '@nestjs/common';
import { MessageError, MessageName } from '@/message';

export class NotFoundException extends BadRequestException {
  constructor(text: MessageName) {
    super(MessageError.NOT_FOUND(text));
  }
}
