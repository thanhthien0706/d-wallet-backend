import { TransactionEntity } from '@/transactions/entities/transaction';
import { ReturnNotificationDto } from '../dto/return-notification.dto';
import { INotificationStrategy } from '../interface/notification-strategy.interface';
import { I18nLanguageService } from '@/i18n-language/i18n-language.service';
import { Injectable } from '@nestjs/common';
import { IArgsNotifications } from '../interface/args-notification.interface';
import { NotificationEntity } from '../entities/notification';
import { SETTING_DEFAULT } from '@constants/setting-default';
import BigNumber from 'bignumber.js';
import { divAmount } from '@/utils/amount-handle';

@Injectable()
export class DepositNotificationStrategy implements INotificationStrategy {
  constructor(private readonly i18nLanguageService: I18nLanguageService) {}

  async handleMessageNotification(
    returnNotification: ReturnNotificationDto,
    transaction: TransactionEntity,
    options?: IArgsNotifications,
  ): Promise<ReturnNotificationDto> {
    const { language, keyTitlePrimary, keyContentPrimary } = options;

    let nameBankAccount;
    // let title, content;

    transaction.card &&
      !transaction.bankAccount &&
      (nameBankAccount = `${transaction.card.brand} .... ${transaction.card.codeLast4}`);

    !transaction.card &&
      transaction.bankAccount &&
      (nameBankAccount = transaction.bankAccount.bankMame);

    const [title, content] = await this.i18nLanguageService.getTitleContentI18n(
      {
        keyTitle: keyTitlePrimary || 'notification.TITLE.DEPOSIT_SUCCESS',
        keyContent: keyContentPrimary || 'notification.CONTENT.DEPOSIT_SUCCESS',
        optionsContent: {
          args: {
            amount: divAmount(
              transaction.amount,
              SETTING_DEFAULT.CURRENCY.CENT,
            ),
            nameBankAccount,
          },
        },
      },
      language || SETTING_DEFAULT.LANGUAGE.DEFAULT,
    );

    returnNotification.title = title;
    returnNotification.content = content;

    return returnNotification;
  }

  async handleDepositFailureNotification(
    notification: NotificationEntity,
    transaction: TransactionEntity,
  ) {
    let paymentMethod;

    const returnNotification: ReturnNotificationDto = {
      content: '',
      title: '',
      ...notification,
      transactionId: transaction.id,
    };

    transaction.card &&
      !transaction.bankAccount &&
      (paymentMethod = `${transaction.card.brand} ... ${transaction.card.codeLast4}`);

    !transaction.card &&
      transaction.bankAccount &&
      (paymentMethod = transaction.bankAccount.bankMame);

    const [title, content] = await this.i18nLanguageService.getTitleContentI18n(
      {
        keyTitle: 'notification.TITLE.DEPOSIT_FAILURE',
        keyContent: 'notification.CONTENT.DEPOSIT_FAILURE',
        optionsContent: {
          args: {
            amount: divAmount(
              transaction.amount,
              SETTING_DEFAULT.CURRENCY.CENT,
            ),
            paymentMethod,
          },
        },
      },
    );

    returnNotification.content = content;
    returnNotification.title = title;

    return returnNotification;
  }
}
