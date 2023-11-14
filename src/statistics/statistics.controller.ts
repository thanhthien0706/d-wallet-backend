import { UserInforValidate } from '@/users/dto/user-infor-validate.dto';
import { Auth } from '@decorators/auth.decorator';
import { User } from '@decorators/user.decorator';
import { Controller, Get, Query } from '@nestjs/common';
import { FilterStatisticDefaultDto } from './dto/filter-statistic-default.dto';
import { StatisticsService } from './statistics.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FilterStatisticTransactionDto } from './dto/filter-statistic-transaction.dto';
import { ReturnStatisticDefault } from './dto/return-statistic-default.dto';
import { Serialize } from '@decorators/Serialize.decorator';
import { ReturnStatisticTransactionDto } from './dto/return-statistic-transaction.dto';
import { ReturnStatisticTypeTransactionDto } from './dto/return-statistic-type-transaction.dto';

@ApiBearerAuth()
@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticService: StatisticsService) {}

  @Auth()
  @Get()
  @ApiOkResponse({
    description: 'Get information statistic default',
    type: ReturnStatisticDefault,
  })
  @Serialize(ReturnStatisticDefault)
  statisticDefault(
    @Query() { year }: FilterStatisticDefaultDto,
    @User() account: UserInforValidate,
  ) {
    return this.statisticService.handleStatisticsDefault(account.id, year);
  }

  @Auth()
  @Get('income-expense')
  @ApiOkResponse({
    description: 'Get information statistic income expense',
    type: ReturnStatisticTransactionDto,
  })
  @Serialize(ReturnStatisticTransactionDto)
  statisticAmountIncomeExpense(
    @Query() filterStatisticTransactionDto: FilterStatisticTransactionDto,
    @User() account: UserInforValidate,
  ) {
    return this.statisticService.handleStatisticIncomeExpense(
      account.id,
      filterStatisticTransactionDto,
    );
  }

  @Auth()
  @Get('type-transaction')
  @ApiOkResponse({
    description: 'Get information statistic by type transaction',
    type: ReturnStatisticTypeTransactionDto,
  })
  @Serialize(ReturnStatisticTypeTransactionDto)
  statisticByTypeTransaction(
    @Query() filterStatisticTransactionDto: FilterStatisticTransactionDto,
    @User() account: UserInforValidate,
  ) {
    return this.statisticService.handleStatisticByTypeTransaction(
      account.id,
      filterStatisticTransactionDto,
    );
  }
}
