import { TransactionsService } from '@/transactions/transactions.service';
import { FilterStatisticType } from '@enums/type-filter-statistic';
import { Injectable } from '@nestjs/common';
import { FilterStatisticTransactionDto } from './dto/filter-statistic-transaction.dto';
import { fi } from 'date-fns/locale';
import { ReturnStatisticTransactionDto } from './dto/return-statistic-transaction.dto';
import { IncomeExpenseInterface } from './interfaces/income-expense.interface';
import { divAmount } from '@/utils/amount-handle';
import { SETTING_DEFAULT } from '@constants/setting-default';
import { StatisticTypeTransactionInterface } from './interfaces/statistic-type-transaction.interface';
import { ReturnStatisticTypeTransactionDto } from './dto/return-statistic-type-transaction.dto';
import { IncomeExpenseDto } from './dto/income-expense.dto';

@Injectable()
export class StatisticsService {
  constructor(private readonly transactionService: TransactionsService) { }

  async handleStatisticsDefault(
    accountId: number,
    year: string = new Date().getFullYear().toString(),
  ) {
    const rsResponse =
      await this.transactionService.getStatisticDefaultTransaction(
        accountId,
        year,
      );

    const newData = {
      ...rsResponse,
      average: divAmount(
        rsResponse.average,
        SETTING_DEFAULT.CURRENCY.CENT,
      ).toNumber(),
      highestAmount: divAmount(
        rsResponse.highestAmount,
        SETTING_DEFAULT.CURRENCY.CENT,
      ).toNumber(),
      lowestAmount: divAmount(
        rsResponse.lowestAmount,
        SETTING_DEFAULT.CURRENCY.CENT,
      ).toNumber(),
    };

    return newData;
  }

  async handleStatisticIncomeExpense(
    accountId,
    filterStatisticTransactionDto: FilterStatisticTransactionDto,
  ) {
    const { type } = filterStatisticTransactionDto;
    const resultQuery =
      await this.transactionService.getStatisticIncomeExpenseTransaction(
        accountId,
        filterStatisticTransactionDto.date,
        filterStatisticTransactionDto.type,
      );

    console.log(resultQuery)

    const { start, end } = {
      [FilterStatisticType.WEEKLY]: {
        start: 1,
        end: 7,
      },
      [FilterStatisticType.MONTHLY]: {
        start: 1,
        end: 31,
      },
      [FilterStatisticType.QUARTERLY]: {
        start: 1,
        end: 4,
      },

      [FilterStatisticType.YEARLY]: {
        start: 1,
        end: 12,
      },
    }[type];

    const newData: IncomeExpenseInterface[] =
      this.updateDataStatisticIncomeExpense(start, end, resultQuery);

    const [labels, incomes, expenses] = newData.reduce(
      ([dLabels, dIncomes, dExpenses], value) => {
        dLabels.push(value.label);
        dIncomes.push(value.income);
        dExpenses.push(value.expense);
        return [dLabels, dIncomes, dExpenses];
      },
      [[], [], []],
    );

    const totalExpenses = expenses.reduce((total, val) => total + val);
    const totalIncomes = incomes.reduce((total, val) => total + val);

    return {
      data: newData,
      labels,
      incomes,
      expenses,
      type,
      totalExpenses,
      totalIncomes,
    };
  }

  updateDataStatisticIncomeExpense(
    start: number,
    end: number,
    dataFilter: IncomeExpenseDto[],
  ) {
    const newDataStatistic = [];
    for (let i = start; i <= end; i++) {
      const currentData = dataFilter.find((data) => data.label == i);
      newDataStatistic.push({
        label: i,
        income: currentData
          ? divAmount(
            currentData.income,
            SETTING_DEFAULT.CURRENCY.CENT,
          ).toNumber()
          : 0,
        expense: currentData
          ? divAmount(
            currentData.expense,
            SETTING_DEFAULT.CURRENCY.CENT,
          ).toNumber()
          : 0,
      });
    }

    return newDataStatistic;
  }

  async handleStatisticByTypeTransaction(
    accountId,
    filterStatisticTransactionDto: FilterStatisticTransactionDto,
  ): Promise<ReturnStatisticTypeTransactionDto> {
    const { type } = filterStatisticTransactionDto;
    const resultQuery =
      await this.transactionService.getStatisticTypeTransaction(
        accountId,
        filterStatisticTransactionDto.date,
        filterStatisticTransactionDto.type,
      );

    const newData = resultQuery.map((data) => {
      return {
        ...data,
        totalAmount: divAmount(
          data.totalAmount,
          SETTING_DEFAULT.CURRENCY.CENT,
        ).toNumber(),
      } as StatisticTypeTransactionInterface;
    });

    const [labels, percents, totalAmountWithTypeTransactions] = newData.reduce(
      ([dLabels, dPercents, dTotal], value) => {
        dLabels.push(value.typeTransaction);
        dPercents.push(value.percent);
        dTotal.push(value.totalAmount);
        return [dLabels, dPercents, dTotal];
      },
      [[], [], []],
    );

    const totalAmount = totalAmountWithTypeTransactions.reduce(
      (total, val) => total + val,
    );

    return {
      data: newData,
      labels,
      percents,
      totalAmount,
      totalAmountWithTypeTransactions,
      type,
    };
  }
}
