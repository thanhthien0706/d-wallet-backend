import { BaseService, Pagination } from '@/common/base.service';
import { Injectable } from '@nestjs/common';
import { NotificationSettingEntity } from './entities/notifications-setting';
import { CreateNotificationSettingDto } from './dto/create-notification-setting.dto';
import { UpdateNotificationSettingDto } from './dto/update-notification-setting.dto';
import { AccountEntity } from '@/users/entities/accounts';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageName } from '@/message';
import { NotFoundException } from '@exceptions/not-found.exception';
import { TransactionEntity } from '@/transactions/entities/transaction';
import { TransactionType } from '@enums/transaction';

@Injectable()
export class NotificationSettingService extends BaseService<
  NotificationSettingEntity,
  CreateNotificationSettingDto,
  UpdateNotificationSettingDto
> {
  constructor(
    @InjectRepository(NotificationSettingEntity)
    private readonly notificationSettingRepository: Repository<NotificationSettingEntity>,
  ) {
    super(MessageName.NOTIFICATION_SETTING, notificationSettingRepository);
  }

  findAll(
    filterDto?: any,
  ): Promise<
    NotificationSettingEntity[] | Pagination<NotificationSettingEntity>
  > {
    throw new Error('Method not implemented.');
  }

  async findNotificationSettingByAccount(
    account: AccountEntity,
  ): Promise<NotificationSettingEntity> {
    const notificationSetting =
      await this.notificationSettingRepository.findOne({
        where: {
          account: {
            id: account.id,
          },
        },
      });

    if (!notificationSetting) {
      throw new NotFoundException(MessageName.NOTIFICATION_SETTING);
    }

    return notificationSetting;
  }

  async checkConditionToPushNoti(
    account: AccountEntity,
    transaction: TransactionEntity,
  ): Promise<Boolean> {
    const notificaitonSetting = await this.findNotificationSettingByAccount(
      account,
    );
    if (
      transaction.typeTransaction === TransactionType.DEPOSIT &&
      !notificaitonSetting.depositToWallet
    ) {
      return false;
    }

    if (
      transaction.typeTransaction === TransactionType.WITHDRAW &&
      !notificaitonSetting.withdrawFromWallet
    ) {
      return false;
    }

    if (transaction.typeTransaction === TransactionType.TRANSFER) {
      if (
        !notificaitonSetting.sendMoneyToSomeone &&
        transaction.sender === account
      ) {
        return false;
      }

      if (
        !notificaitonSetting.receiveMoneyToSomeone &&
        transaction.receiver === account
      ) {
        return false;
      }
    }

    return true;
  }
}
