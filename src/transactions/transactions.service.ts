import { BaseService, Pagination } from '@/common/base.service';
import {
  ConflictException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { TransactionEntity } from './entities/transaction';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UsersService } from '@/users/users.service';
import { MessageName } from '@/message';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  EntityManager,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { BalanceHistoriesService } from '@/balance-histories/balance-histories.service';
import { NotFoundException } from '@exceptions/not-found.exception';
import { TransactionManager } from '@/common/transaction-manager';
import { TransactionType } from '@enums/transaction';
import { StatusType } from '@enums/status';
import { DepositWithCardDto } from './dto/deposit-transaction.dto';
import { AccountEntity } from '@/users/entities/accounts';
import { CardsService } from '@/cards/cards.service';
import { StripeService } from '@/stripe/stripe.service';
import { Currency } from '@constants/currency';
import BigNumber from 'bignumber.js';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { PaymentMethodType } from '@enums/payment-method';
import { NotificationsService } from '@/notifications/notifications.service';
import { CreateNotificationDto } from '@/notifications/dto/create-notification.dto';
import { NotificationType } from '@enums/notification';
import { FirebaseService } from '@/firebase/firebase.service';
import { DepositNotificationStrategy } from '@/notifications/stratery/deposit-notification.strategy';
import { FilterRecentUsersDto } from './dto/filter-recent-user.dto';
import {
  divAmount,
  minusAmount,
  multiplyAmount,
  plusAmount,
} from '@/utils/amount-handle';
import { SETTING_DEFAULT } from '@constants/setting-default';
import { FilterStatisticType } from '@enums/type-filter-statistic';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { GetBalanceErrorException } from '@exceptions/get-balance-error.exception';
import { IncomeExpenseDto } from '@/statistics/dto/income-expense.dto';
import { StatisticTypeTransactionDto } from '@/statistics/dto/statistic-type-transaction.dto';
import { BadRequestException } from '@exceptions/bad-request.exception';
import { TypeError } from '@enums/type-error';
import { LocalBanksService } from '@/local-banks/local-banks.service';

@Injectable()
export class TransactionsService extends BaseService<
  TransactionEntity,
  CreateTransactionDto,
  UpdateTransactionDto
> {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    private readonly usersService: UsersService,
    private readonly balanceService: BalanceHistoriesService,
    private readonly transactionManager: TransactionManager,
    private readonly cardService: CardsService,
    @Inject(forwardRef(() => StripeService))
    private readonly stripeService: StripeService,
    private readonly notificationService: NotificationsService,
    private readonly firebaseService: FirebaseService,
    private readonly depositNotificationStrategy: DepositNotificationStrategy,
    private readonly localBankService: LocalBanksService
  ) {
    super(MessageName.USER, transactionRepository);
  }

  async getRecentUserTransfer(
    filterRecentUser: FilterRecentUsersDto,
  ): Promise<Pagination<any>> {
    const { senderId, limit, order, skip } = filterRecentUser;

    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        where: {
          sender: { id: senderId },
          typeTransaction: TransactionType.TRANSFER,
        },
        take: limit,
        skip,
        order,
        relations: {
          receiver: {
            userProfile: true,
          },
        },
      },
    );

    const uniqueTransactions = transactions.filter(
      (transaction, index, self) => {
        return (
          index ===
          self.findIndex((u) => u.receiver.id === transaction.receiver.id)
        );
      },
    );

    const receivers = uniqueTransactions.map((uniqueTransaction) => {
      return {
        ...uniqueTransaction.receiver,
        ...uniqueTransaction.receiver.userProfile,
      };
    });

    return {
      data: receivers,
      total: total,
    };
  }

  handleCreateAtTransaction(
    where: any,
    startDateFil: string,
    endDateFil: string,
  ) {
    if (startDateFil && endDateFil) {
      where.createdAt = Between(new Date(startDateFil), new Date(endDateFil));
    } else if (startDateFil) {
      where.createdAt = MoreThanOrEqual(new Date(startDateFil));
    } else if (endDateFil) {
      where.createdAt = LessThanOrEqual(new Date(endDateFil));
    }
  }

  handleAmountTransaction(where: any, startAmount: number, endAmount: number) {
    startAmount = multiplyAmount(
      startAmount,
      SETTING_DEFAULT.CURRENCY.CENT,
    ).toNumber();

    endAmount = multiplyAmount(
      endAmount,
      SETTING_DEFAULT.CURRENCY.CENT,
    ).toNumber();

    if (startAmount && endAmount) {
      where.amount = Between(startAmount, endAmount);
    } else if (startAmount) {
      where.amount = MoreThanOrEqual(startAmount);
    } else if (endAmount) {
      where.amount = LessThanOrEqual(endAmount);
    }
  }

  handleTypePaymentTransaction(where: any, typePayment: PaymentMethodType) {
    const type = {
      [PaymentMethodType.CARD]: 'card',
      [PaymentMethodType.LOCAL_BANK]: 'bankAccount',
      [PaymentMethodType.BANK_ACCOUNT]: 'localBank',
    }[typePayment];

    type && (where[type] = Not(IsNull()));
  }

  async findAll(
    filterTransactionDto?: FilterTransactionDto,
  ): Promise<Pagination<TransactionEntity>> {
    const {
      startAmount,
      endDate,
      endAmount,
      limit,
      order,
      senderId,
      startDate,
      skip,
      status,
      typePayment,
      typeTransaction,
    } = filterTransactionDto;

    const where = {
      createdAt: null,
      amount: null,
      status,
      typeTransaction: typeTransaction,
      card: null,
      bankAccount: null,
      localBank: null,
    };

    this.handleCreateAtTransaction(where, startDate, endDate);
    this.handleAmountTransaction(where, startAmount, endAmount);
    this.handleTypePaymentTransaction(where, typePayment);

    const whereOrConditon = [
      {
        sender: {
          id: senderId,
        },
        ...where,
      },
      {
        receiver: {
          id: senderId,
        },
        ...where,
      },
    ];

    let [data, total] = await this.transactionRepository.findAndCount({
      where: whereOrConditon,
      take: limit,
      skip: skip,
      order: order,
      relations: {
        sender: true,
        receiver: true,
        card: true,
        bankAccount: true,
        localBank: true,
      },
    });

    data = data.map((transactionModel) => {
      transactionModel.amount = divAmount(
        transactionModel.amount,
        SETTING_DEFAULT.CURRENCY.CENT,
      ).toNumber();
      return {
        ...transactionModel,
      };
    });

    return {
      data,
      total,
    };
  }

  async handleAmountTransfer(createTransferDto: CreateTransferDto) {
    //  get balance and update balance value
    const balanceTo = this.balanceService.getBalanceLatest(
      createTransferDto.to,
    );

    const balanceFrom = this.balanceService.getBalanceLatest(
      createTransferDto.from,
    );

    const [rsBalanceTo, rsBalanceFrom] = await Promise.all([
      balanceTo,
      balanceFrom,
    ]);

    if (!rsBalanceFrom || !rsBalanceTo) {
      throw new ConflictException('Error get balance');
    }

    const newBalanceTo = plusAmount(
      rsBalanceTo.value,
      createTransferDto.amount,
    ).toNumber();
    const newBalanceFrom = minusAmount(
      rsBalanceFrom.value,
      createTransferDto.amount,
    ).toNumber();

    return { newBalanceTo, newBalanceFrom };
  }

  async saveBalanceTransfer(
    newtransaction: TransactionEntity,
    userTo: AccountEntity,
    userFrom: AccountEntity,
    newBalanceTo: number,
    newBalanceFrom: number,
    entityManager: EntityManager,
  ) {
    const createBalanceTo = this.balanceService.createWithTransaction(
      {
        status: StatusType.COMPLETED,
        transaction: newtransaction,
        account: userTo,
        value: newBalanceTo.toString(),
      },
      entityManager,
    );

    const createBalanceFrom = this.balanceService.createWithTransaction(
      {
        status: StatusType.COMPLETED,
        transaction: newtransaction,
        account: userFrom,
        value: newBalanceFrom.toString(),
      },
      entityManager,
    );

    await Promise.all([createBalanceTo, createBalanceFrom]);
  }

  async transfer(createTransferDto: CreateTransferDto) {
    let newtransaction: TransactionEntity;

    // check balance sender enough
    const checkBalanceEnough = await this.balanceService.checkBalanceEnough(
      createTransferDto.from,
      createTransferDto.amount,
    );

    if (!checkBalanceEnough) {
      throw new ConflictException('You not enough funds to transfer');
    }

    // find user to and user from
    const userToFind = this.usersService.findById(createTransferDto.to);
    const userFromFind = this.usersService.findById(createTransferDto.from);

    const [userTo, userFrom] = await Promise.all([userToFind, userFromFind]);

    if (!userTo) {
      throw new NotFoundException(
        `Not found user with id ${createTransferDto.to}` as MessageName.USER,
      );
    }

    const { newBalanceTo, newBalanceFrom } = await this.handleAmountTransfer(
      createTransferDto,
    );

    await this.transactionManager.transaction(
      async (entityManager: EntityManager) => {
        const transactionModel: CreateTransactionDto = {
          amount: createTransferDto.amount.toString(),
          sender: userFrom,
          receiver: userTo,
          status: StatusType.COMPLETED,
          typeTransaction: TransactionType.TRANSFER,
          notes: createTransferDto.notes,
        };

        newtransaction = await entityManager.save(
          TransactionEntity,
          transactionModel,
        );

        await this.saveBalanceTransfer(
          newtransaction,
          userTo,
          userFrom,
          newBalanceTo,
          newBalanceFrom,
          entityManager,
        );
      },
    );

    const createNotificationTo: CreateNotificationDto = {
      account: userTo,
      type: NotificationType.TRANSFER,
      transaction: newtransaction,
    };

    const createNotificationFrom: CreateNotificationDto = {
      account: userFrom,
      type: NotificationType.TRANSFER,
      transaction: newtransaction,
    };

    await this.notificationService.saveMultiple([
      createNotificationTo,
      createNotificationFrom,
    ]);

    delete newtransaction.sender;
    delete newtransaction.receiver;
    createTransferDto.amount = divAmount(
      createTransferDto.amount,
      SETTING_DEFAULT.CURRENCY.CENT,
    ).toNumber();
    return {
      ...newtransaction,
      ...createTransferDto,
    };
  }

  async deposit(
    depositWithCardDto: DepositWithCardDto,
    account: AccountEntity,
  ) {
    const { amount, cardId } = depositWithCardDto;
    const { tokenStripe } = account;

    const cardPaymentMethod = await this.cardService.findCardMethodById(cardId);
    let paymenIntent;

    let transaction: TransactionEntity;
    await this.transactionManager.transaction(
      async (entityManager: EntityManager) => {
        transaction = this.transactionRepository.create();
        transaction.amount = String(amount);
        transaction.status = StatusType.COMPLETED;
        transaction.typeTransaction = TransactionType.DEPOSIT;
        transaction.notes = `Deposit to app with amount: ${amount}`;
        transaction.card = cardPaymentMethod;
        transaction.sender = account

        await this.transactionRepository.save(transaction);
        const latestBalanceHistory = await this.balanceService.getBalanceLatest(
          account.id,
        );
        const balance = BigNumber(latestBalanceHistory.value)
          .plus(amount)
          .toString();
        await this.balanceService.createWithTransaction(
          {
            account: account,
            status: StatusType.COMPLETED,
            value: balance,
            transaction: transaction,
          },
          entityManager,
        );

        paymenIntent = await this.stripeService.createPaymentIntent(
          amount,
          Currency.USD,
          cardPaymentMethod.token,
          tokenStripe,
          transaction.id,
        );
      },
    );

    return {
      ...transaction,
    };
  }

  async handleDepositComplete(transactionId: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
    });
    if (!transaction) {
      throw new NotFoundException(MessageName.TRANSACTION);
    }
    if (transaction.status !== StatusType.PENDING) {
      throw new Error('have wrong in handle deposit complete');
    }

    transaction.status = StatusType.COMPLETED;
    await this.transactionRepository.save(transaction);
    const balanceHistory =
      await this.balanceService.findBalanceHistoryByTransaction(transaction);
    balanceHistory.status = StatusType.COMPLETED;
    await this.balanceService.saveBalanceHistory(balanceHistory);

    // Save notification into database
    const createDepositSuccessNotification: CreateNotificationDto = {
      account: balanceHistory.account,
      type: NotificationType.DEPOSIT,
      transaction: transaction,
    };

    const depositSuccessNotification =
      await this.notificationService.saveNotification(
        createDepositSuccessNotification,
      );
    const returnDepositSuccessNotification =
      await this.notificationService.handleNotification(
        depositSuccessNotification,
        balanceHistory.account.id,
      );

    // push notification into FCM
    await this.firebaseService.sendNotification(
      returnDepositSuccessNotification,
      balanceHistory.account,
      transaction,
    );
  }

  async handleDepositFail(transactionId: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
    });
    if (!transaction) {
      throw new NotFoundException(MessageName.TRANSACTION);
    }
    transaction.status = StatusType.FAILED;
    await this.transactionRepository.save(transaction);
    const balanceHistory =
      await this.balanceService.findBalanceHistoryByTransaction(transaction);
    await this.balanceService.removeBalanceHistory(balanceHistory);

    // Save notifcation into database
    const createDepositFailureNotification: CreateNotificationDto = {
      account: balanceHistory.account,
      type: NotificationType.DEPOSIT,
      transaction: transaction,
    };

    const depositFailureNotification =
      await this.notificationService.saveNotification(
        createDepositFailureNotification,
      );
    const returnDepositFailureNotification =
      await this.depositNotificationStrategy.handleDepositFailureNotification(
        depositFailureNotification,
        transaction,
      );

    // Push notification into FCM
    await this.firebaseService.sendNotification(
      returnDepositFailureNotification,
      balanceHistory.account,
      transaction,
    );
  }

  async withdraw(createWithdrawDto: CreateWithdrawDto, account: AccountEntity) {
    let newtransaction: TransactionEntity;
    // check balance enough to withdraw
    const checkBalanceEnough = await this.balanceService._checkBalanceEnough(
      account.id,
      createWithdrawDto.amount,
    );

    if (!checkBalanceEnough) {
      throw new BadRequestException(TypeError.NOT_ENOUGH_MONEY);
    }

    /**
     * TODO:
     * Call handleTransferToLocalbank() function in local-bank.service
     */
    const localBank = await this.localBankService.findById(createWithdrawDto.localBankId)

    const newBalance = await this.handleAmountWithdraw(
      account,
      createWithdrawDto.amount,
    );
    await this.transactionManager.transaction(
      async (entityManager: EntityManager) => {
        const transactionModel: CreateTransactionDto = {
          amount: createWithdrawDto.amount,
          status: StatusType.COMPLETED,
          typeTransaction: TransactionType.WITHDRAW,
          notes: createWithdrawDto.notes,
          sender: account,
          localBank: localBank
        };

        newtransaction = await entityManager.save(
          TransactionEntity,
          transactionModel,
        );

        await this.saveBalanceWithdraw(
          newtransaction,
          entityManager,
          newBalance,
          account,
        );
      },
    );

    const createNotificationTo: CreateNotificationDto = {
      account: account,
      type: NotificationType.DEPOSIT,
      transaction: newtransaction,
    };

    await this.notificationService.saveNotification(createNotificationTo);

    createWithdrawDto.amount = divAmount(
      createWithdrawDto.amount,
      SETTING_DEFAULT.CURRENCY.CENT,
    ).toString();

    return {
      ...newtransaction,
      ...createWithdrawDto,
    };
  }

  async getInforTransactionByIdandIdUser(
    idTransaction: number,
    idUser: number,
  ) {
    const transaction = await this.transactionRepository.findOne({
      where: [
        {
          id: idTransaction,
          sender: {
            id: idUser,
          },
        },
        {
          id: idTransaction,
          receiver: {
            id: idUser,
          },
        },
      ],
      relations: {
        sender: true,
        receiver: true,
        card: true,
        bankAccount: true,
        localBank: true,
        balanceHistories: true,
      },
    });

    transaction.amount = divAmount(
      transaction.amount,
      SETTING_DEFAULT.CURRENCY.CENT,
    ).toString();

    return transaction;
  }

  getStatisticDefaultTransaction(accountId: number, year: string) {
    return this.transactionRepository
      .createQueryBuilder()
      .select('MAX(amount) ', 'highestAmount')
      .addSelect('MIN(amount)', 'lowestAmount')
      .addSelect('TRUNCATE(AVG(amount),2)', 'average')
      .addSelect('COUNT(*)', 'totalTransaction')
      .addSelect(
        `MAX(CASE WHEN amount = (SELECT MAX(amount) FROM transactions WHERE YEAR(createdAt) = ${year}) THEN createdAt END)`,
        'dateHighestAmount',
      )
      .addSelect(
        `MAX(CASE WHEN amount = (SELECT MIN(amount) FROM transactions WHERE YEAR(createdAt) = ${year}) THEN createdAt END)`,
        'dateLowestAmount',
      )
      .where(`YEAR(createdAt) = :year`, {
        year,
      })
      .andWhere('senderId = :accountId OR receiverId = :accountId', {
        accountId,
      })
      .andWhere("status = 'COMPLETED'", {
        accountId,
      })
      .getRawOne();
  }

  getStatisticIncomeExpenseTransaction(
    accountId: number,
    date: string = new Date().toISOString(),
    type: FilterStatisticType,
  ): Promise<IncomeExpenseDto[]> {
    const { whereText, queryText, groupBytext } = {
      [FilterStatisticType.WEEKLY]: {
        whereText: `WEEK(createdAt) = WEEK(:date)`,
        queryText: 'DAYOFWEEK(createdAt) AS label',
        groupBytext: 'DAYOFWEEK(createdAt)',
      },
      [FilterStatisticType.MONTHLY]: {
        whereText: `MONTH(createdAt) = MONTH(:date)`,
        queryText: 'DAYOFMONTH(createdAt) AS label',
        groupBytext: 'DAYOFMONTH(createdAt)',
      },
      [FilterStatisticType.QUARTERLY]: {
        whereText: `YEAR(createdAt) = YEAR(:date)`,
        queryText: 'QUARTER(createdAt) AS label',
        groupBytext: 'QUARTER(createdAt)',
      },

      [FilterStatisticType.YEARLY]: {
        whereText: `YEAR(createdAt) = YEAR(:date)`,
        queryText: 'MONTH(createdAt) AS label',
        groupBytext: 'MONTH(createdAt)',
      },
    }[type];

    const queryBuilder = this.transactionRepository
      .createQueryBuilder()
      .select(queryText)
      .addSelect(
        `SUM(CASE WHEN typeTransaction = "DEPOSIT" OR (typeTransaction = "TRANSFER" AND receiverId = ${accountId}) THEN amount ELSE 0 END)`,
        'income',
      )
      .addSelect(
        `SUM(CASE WHEN typeTransaction = "WITHDRAW" OR (typeTransaction = "TRANSFER" AND senderId = ${accountId}) THEN amount ELSE 0 END)`,
        'expense',
      )
      .where(whereText, {
        date,
      })
      .andWhere('senderId = :accountId OR receiverId = :accountId', {
        accountId,
      })
      .andWhere("status = 'COMPLETED'")
      .groupBy(groupBytext)
      .orderBy('label', 'ASC');

    return queryBuilder.getRawMany();
  }

  getStatisticTypeTransaction(
    accountId: number,
    date: string = new Date().toISOString(),
    type: FilterStatisticType,
  ): Promise<StatisticTypeTransactionDto[]> {
    const { whereText } = {
      [FilterStatisticType.WEEKLY]: {
        whereText: `WEEK(createdAt) = WEEK(:date)`,
      },
      [FilterStatisticType.MONTHLY]: {
        whereText: `MONTH(createdAt) = MONTH(:date)`,
      },
      [FilterStatisticType.QUARTERLY]: {
        whereText: `QUARTER(createdAt) = QUARTER(:date)`,
      },

      [FilterStatisticType.YEARLY]: {
        whereText: `YEAR(createdAt) = YEAR(:date)`,
      },
    }[type];

    const queryBuilder = this.transactionRepository
      .createQueryBuilder()
      .select('typeTransaction')
      .addSelect(
        'TRUNCATE(SUM(amount)/(SELECT SUM(amount) FROM transactions)*100,2) AS percent',
      )
      .addSelect('SUM(amount) AS totalAmount')
      .where(whereText, { date })
      .andWhere('senderId = :accountId OR receiverId = :accountId', {
        accountId,
      })
      .andWhere("status = 'COMPLETED'")
      .groupBy('typeTransaction');

    return queryBuilder.getRawMany();
  }

  async handleAmountWithdraw(account: AccountEntity, amount: string) {
    const balance = await this.balanceService.getBalanceLatest(account.id);

    if (!balance) {
      throw new GetBalanceErrorException();
    }

    const newBalance = minusAmount(balance.value, amount).toString();

    return newBalance;
  }

  async saveBalanceWithdraw(
    newtransaction: TransactionEntity,
    entityManager: EntityManager,
    newBalance: string,
    account: AccountEntity,
  ) {
    await this.balanceService.createWithTransaction(
      {
        status: StatusType.COMPLETED,
        transaction: newtransaction,
        account,
        value: newBalance,
      },
      entityManager,
    );
  }
}
