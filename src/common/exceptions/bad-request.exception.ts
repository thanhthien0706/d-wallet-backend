import { MessageError } from '@/message';
import { TypeError } from '@enums/type-error';
import { BadRequestException as BadRequestExceptionCommon } from '@nestjs/common';

export class BadRequestException extends BadRequestExceptionCommon {
  constructor(errorType: TypeError) {
    super(MessageError[errorType]());
  }
}
