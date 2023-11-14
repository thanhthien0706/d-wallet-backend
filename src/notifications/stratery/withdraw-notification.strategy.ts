import { Injectable } from '@nestjs/common';
import { INotificationStrategy } from '../interface/notification-strategy.interface';
import { TransactionEntity } from '@/transactions/entities/transaction';
import { ReturnNotificationDto } from '../dto/return-notification.dto';
import { IArgsNotifications } from '../interface/args-notification.interface';
import { I18nLanguageService } from '@/i18n-language/i18n-language.service';
import { SETTING_DEFAULT } from '@constants/setting-default';
import BigNumber from 'bignumber.js';
import { divAmount } from '@/utils/amount-handle';

@Injectable()
export class WithdrawNotificationStrategy implements INotificationStrategy {
  constructor(private readonly i18nLanguageService: I18nLanguageService) {}

  async handleMessageNotification(
    returnNotification: ReturnNotificationDto,
    transaction: TransactionEntity,
    options?: IArgsNotifications,
  ): Promise<ReturnNotificationDto> {
    const { language, keyTitlePrimary, keyContentPrimary } = options;

    const [title, content] = await this.i18nLanguageService.getTitleContentI18n(
      {
        keyTitle: keyTitlePrimary || 'notification.TITLE.WITHDRAW_SUCCESS',
        keyContent:
          keyContentPrimary || 'notification.CONTENT.WITHDRAW_SUCCESS',
        optionsContent: {
          args: {
            amount: divAmount(
              transaction.amount,
              SETTING_DEFAULT.CURRENCY.CENT,
            ),
            nameLocalBank: transaction.localBank.bankName,
          },
        },
      },
      language || SETTING_DEFAULT.LANGUAGE.DEFAULT,
    );

    returnNotification.title = title;
    returnNotification.content = content;

    return returnNotification;
  }
}
