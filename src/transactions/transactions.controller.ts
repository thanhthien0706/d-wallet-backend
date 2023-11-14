import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '@decorators/auth.decorator';
import { User } from '@decorators/user.decorator';
import { AccountEntity } from '@/users/entities/accounts';
import { StatusType } from '@enums/status';
import { TransactionsService } from './transactions.service';
import { DepositWithCardDto } from './dto/deposit-transaction.dto';
import { ReturnTransferDto } from './dto/return-transfer.dto';
import { TransactionEntity } from './entities/transaction';
import { Serialize } from '@decorators/Serialize.decorator';
import { ReturnDepositDto } from './dto/return-deposit.dto';
import { ReturnTransactionPaginationDto } from './dto/return-transaction-pagination.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { ReturnTransactionDto } from './dto/return-transaction.dto';
import { UserInforValidate } from '@/users/dto/user-infor-validate.dto';
import { ReturnSearchUserDto } from '@/users/dto/return-search-user.dto';
import { FilterRecentUsersDto } from './dto/filter-recent-user.dto';
import { multiplyAmount } from '@/utils/amount-handle';
import { SETTING_DEFAULT } from '@constants/setting-default';
import { SecondPasswordStrategy } from '@/auth/strategies/secondPassword.strategy';
import { SecondPasswordGuard } from '@guards/second-password.guard';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { ReturnWithdrawDto } from './dto/return-withdraw.dto';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Auth()
  @Get('recent-users')
  @Serialize(ReturnSearchUserDto)
  @ApiOkResponse({
    description: 'Recent users transfer',
    type: ReturnSearchUserDto,
  })
  getRecentUser(
    @User() account: UserInforValidate,
    @Query() filterRecentUser: FilterRecentUsersDto,
  ) {
    filterRecentUser.senderId = account.id;
    return this.transactionsService.getRecentUserTransfer(filterRecentUser);
  }

  // @UseGuards(SecondPasswordGuard)
  @Auth()
  @ApiHeader({ name: 'TokenSecondPassword' })
  @Post('transfer')
  @ApiResponse({
    description: 'Api transfer money to another user',
    type: ReturnTransferDto,
  })
  @Serialize(ReturnTransferDto)
  transfer(
    @Body() createTransferDto: CreateTransferDto,
    @User() account: AccountEntity,
  ) {
    createTransferDto.from = account.id;
    createTransferDto.amount = multiplyAmount(
      createTransferDto.amount,
      SETTING_DEFAULT.CURRENCY.CENT,
    ).toNumber();
    return this.transactionsService.transfer(createTransferDto);
  }

  @Auth()
  // @UseGuards(SecondPasswordGuard)
  @ApiHeader({ name: 'TokenSecondPassword' })
  @Post('deposit')
  @ApiResponse({
    description: 'Api deposit money to wallet',
    type: ReturnDepositDto,
  })
  @Serialize(ReturnDepositDto)
  async deposit(
    @Body() depositWithCardDto: DepositWithCardDto,
    @User() account: AccountEntity,
  ) {
    return this.transactionsService.deposit(depositWithCardDto, account);
  }

  // @UseGuards(SecondPasswordGuard)
  @Auth()
  @ApiHeader({ name: 'TokenSecondPassword' })
  @ApiOkResponse({
    description: 'Api for withdraw money',
    type: ReturnWithdrawDto,
  })
  @Serialize(ReturnWithdrawDto)
  @Post('withdraw')
  withdraw(
    @Body() createWithdrawDto: CreateWithdrawDto,
    @User() account: AccountEntity,
  ) {
    createWithdrawDto.amount = multiplyAmount(
      createWithdrawDto.amount,
      SETTING_DEFAULT.CURRENCY.CENT,
    ).toString();
    return this.transactionsService.withdraw(createWithdrawDto, account);
  }

  @Auth()
  @Get('history')
  @ApiOkResponse({
    description: 'API get transaction history',
    type: ReturnTransactionPaginationDto,
  })
  @Serialize(ReturnTransactionPaginationDto)
  transactionHistory(
    @Query() filterTransactionDto: FilterTransactionDto,
    @User() account: AccountEntity,
  ) {
    filterTransactionDto.senderId = account.id;
    return this.transactionsService.findAll(filterTransactionDto);
  }

  @Auth()
  @Get(':idTransaction')
  @Serialize(ReturnTransactionDto)
  @ApiOkResponse({
    description: 'API get detail transaction history',
    type: ReturnTransactionDto,
  })
  inforTransactionDetail(
    @Param('idTransaction') id: number,
    @User() account: AccountEntity,
  ) {
    return this.transactionsService.getInforTransactionByIdandIdUser(
      id,
      account.id,
    );
  }
}
