import { EmailSubject } from '@/message';
import { AccountEntity } from '@/users/entities/accounts';
import { SendMailErrorException } from '@exceptions/Send-mail-error.exception';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailService: MailerService) {}

  async sendResetPasswordEmail(account: AccountEntity, code: string) {
    try {
      await this.mailService.sendMail({
        to: account.email,
        subject: EmailSubject.RESET_PASSWORD,
        template: './resetPassword',
        context: {
          name: account.name,
          code: code,
        },
      });
    } catch (error) {
      throw new SendMailErrorException();
    }
  }
}
