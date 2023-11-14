import { TransactionEntity } from '@/transactions/entities/transaction';
import { ReturnNotificationDto } from '../dto/return-notification.dto';
import { IArgsNotifications } from '../interface/args-notification.interface';
import { INotificationStrategy } from '../interface/notification-strategy.interface';
import { Injectable } from '@nestjs/common';
import { I18nLanguageService } from '@/i18n-language/i18n-language.service';
import { SETTING_DEFAULT } from '@constants/setting-default';
import BigNumber from 'bignumber.js';
import { divAmount } from '@/utils/amount-handle';

@Injectable()
export class TransactionNotificationStrategy implements INotificationStrategy {
  constructor(private readonly i18nLanguageService: I18nLanguageService) {}

  async handleMessageNotification(
    returnNotification: ReturnNotificationDto,
    transaction: TransactionEntity,
    options?: IArgsNotifications,
  ): Promise<ReturnNotificationDto> {
    const {
      language,
      keyTitlePrimary,
      keyContentPrimary,
      keyTitleSecond,
      keyContentSecond,
      accountId,
    } = options;
    let title, content;
    if (
      transaction.sender.id === accountId &&
      transaction.receiver.id !== accountId
    ) {
      [title, content] = await this.i18nLanguageService.getTitleContentI18n(
        {
          keyTitle: keyTitlePrimary || 'notification.TITLE.TRANSFER_SUCCESS',
          keyContent:
            keyContentPrimary || 'notification.CONTENT.TRANSFER_SUCCESS',
          optionsContent: {
            args: {
              amount: divAmount(
                transaction.amount,
                SETTING_DEFAULT.CURRENCY.CENT,
              ),
              userNameTo: transaction.receiver.name,
            },
          },
        },
        language || SETTING_DEFAULT.LANGUAGE.DEFAULT,
      );
    } else {
      [title, content] = await this.i18nLanguageService.getTitleContentI18n(
        {
          keyTitle: keyTitleSecond || 'notification.TITLE.RECEIVE_FROM',
          keyContent: keyContentSecond || 'notification.CONTENT.RECEIVE_FROM',
          optionsTitle: {
            args: {
              senderName: transaction.sender.name,
            },
          },
          optionsContent: {
            args: {
              amount: divAmount(
                transaction.amount,
                SETTING_DEFAULT.CURRENCY.CENT,
              ),
            },
          },
        },
        language || SETTING_DEFAULT.LANGUAGE.DEFAULT,
      );
    }

    returnNotification.title = title;
    returnNotification.content = content;
    return returnNotification;
  }
}
