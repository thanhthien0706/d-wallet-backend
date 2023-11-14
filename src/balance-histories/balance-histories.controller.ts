import { Auth } from '@decorators/auth.decorator';
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BalanceHistoriesService } from './balance-histories.service';
import { User } from '@decorators/user.decorator';
import { AccountEntity } from '@/users/entities/accounts';
import { divAmount } from '@/utils/amount-handle';
import { SETTING_DEFAULT } from '@constants/setting-default';

@ApiBearerAuth()
@ApiTags('balance')
@Auth()
@Controller('balance')
export class BalanceHistoriesController {
  constructor(private readonly balanceService: BalanceHistoriesService) {}

  @Get()
  async getBalanceLatestMe(@User() account: AccountEntity) {
    const rs = await this.balanceService.getBalanceLatest(account.id);

    return {
      ...rs,
      value: divAmount(rs.value, SETTING_DEFAULT.CURRENCY.CENT).toNumber(),
    };
  }
}
