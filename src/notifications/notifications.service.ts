import { BaseService, Pagination } from '@/common/base.service';
import { Injectable } from '@nestjs/common';
import { NotificationEntity } from './entities/notification';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageName } from '@/message';
import { I18nLanguageService } from '@/i18n-language/i18n-language.service';
import { ReturnNotificationDto } from './dto/return-notification.dto';
import { NotificationType } from '@enums/notification';
import { TransactionEntity } from '@/transactions/entities/transaction';
import { AccountEntity } from '@/users/entities/accounts';
import { FilterNotificationDto } from './dto/filter-notificationdto';
import { StatusType } from '@enums/status';
import { SETTING_DEFAULT } from '@constants/setting-default';
import { NotificationSettingEntity } from '@/settings/entities/notifications-setting';
import { INotificationStrategy } from './interface/notification-strategy.interface';
import { NotificationContextService } from './notification-context.service';
import { TransactionNotificationStrategy } from './stratery/transaction-notification.strategy';
import { DepositNotificationStrategy } from './stratery/deposit-notification.strategy';
import { WithdrawNotificationStrategy } from './stratery/withdraw-notification.strategy';

@Injectable()
export class NotificationsService extends BaseService<
  NotificationEntity,
  CreateNotificationDto,
  UpdateNotificationDto
> {
  private language: string = SETTING_DEFAULT.LANGUAGE.DEFAULT;

  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly i18nLanguageService: I18nLanguageService,
    private readonly notificationContextService: NotificationContextService,
    private readonly transactionNotificationStrategy: TransactionNotificationStrategy,
    private readonly depositNotificationStrategy: DepositNotificationStrategy,
    private readonly withdrawNotificationStrategy: WithdrawNotificationStrategy,
  ) {
    super(MessageName.USER, notificationRepository);
  }

  findAll(
    filterDto?: any,
  ): Promise<NotificationEntity[] | Pagination<NotificationEntity>> {
    throw new Error('Method not implemented.');
  }

  async findAllHandle(
    filterNotifiDto?: FilterNotificationDto,
  ): Promise<Pagination<ReturnNotificationDto>> {
    const { type, seen, accountId, limit, skip, order } = filterNotifiDto;
    this.language = filterNotifiDto.language;

    const notifications = await this.notificationRepository.find({
      where: {
        account: {
          id: accountId,
        },
        transaction: {
          status: StatusType.COMPLETED,
        },
        seenByUser: seen,
        type,
      },
      take: limit,
      skip: skip,
      order: order,
      relations: {
        transaction: {
          sender: true,
          receiver: true,
          localBank: true,
          bankAccount: true,
          card: true,
        },
      },
    });

    let notificationDtos: ReturnNotificationDto[] = await Promise.all(
      notifications.map((notification) =>
        this.handleNotification(notification, accountId),
      ),
    );

    return {
      data: notificationDtos,
      total: notificationDtos.length,
    };
  }

  async handleNotification(
    notification: NotificationEntity,
    accountUserId: number,
  ): Promise<ReturnNotificationDto> {
    const { transaction, type } = notification;

    const returnNotification: ReturnNotificationDto = {
      content: '',
      title: '',
      ...notification,
      transactionId: transaction.id,
    };

    type === NotificationType.TRANSFER &&
      this.notificationContextService.setMessageStrategy(
        this.transactionNotificationStrategy,
      );

    type === NotificationType.DEPOSIT &&
      this.notificationContextService.setMessageStrategy(
        this.depositNotificationStrategy,
      );

    type === NotificationType.WITHDRAW &&
      this.notificationContextService.setMessageStrategy(
        this.withdrawNotificationStrategy,
      );

    return await this.notificationContextService.callMessageNotifiStrategy(
      returnNotification,
      transaction,
      { accountId: accountUserId, language: this.language },
    );
  }

  async saveMultiple(createNotifications: CreateNotificationDto[]) {
    const datas = createNotifications.map((notification) =>
      this.notificationRepository.create(notification),
    );

    return await this.notificationRepository.save(datas);
  }

  async saveNotification(createNotification: CreateNotificationDto) {
    return this.notificationRepository.save(createNotification);
  }

  async handleReadedNotification(
    idNotification?: number,
    idAccount?: number,
    status: boolean = true,
  ) {
    if (idNotification) {
      await this.notificationRepository.update(idNotification, {
        seenByUser: status,
      });
    } else {
      const notiNotReaded: NotificationEntity[] =
        await this.notificationRepository.findBy({
          account: { id: idAccount },
          seenByUser: false,
        });

      const notiConverts = notiNotReaded.map((notiEl) => {
        notiEl.seenByUser = status;
        return notiEl;
      });

      await this.notificationRepository.save(notiConverts);
    }
  }

  async handleDeleteNotification(idNotification?: number, idAccount?: number) {
    const today = new Date();

    if (idNotification) {
      await this.notificationRepository.update(idNotification, {
        deletedAt: today,
      });
    } else {
      const notiNotReaded: NotificationEntity[] =
        await this.notificationRepository.findBy({
          account: { id: idAccount },
          seenByUser: false,
        });

      const notiConverts = notiNotReaded.map((notiEl) => {
        notiEl.deletedAt = today;
        return notiEl;
      });

      await this.notificationRepository.save(notiConverts);
    }
  }
}
