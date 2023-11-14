import { MessageError } from '@/message';
import { HttpException, HttpStatus } from '@nestjs/common';

export class WebhookStripeEventException extends HttpException {
  constructor(text: string) {
    super(MessageError.WEBHOOK_EVENT(text), HttpStatus.BAD_GATEWAY);
  }
}
