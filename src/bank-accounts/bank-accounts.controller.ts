import { Body, Controller, Post } from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { CreateBankPaymentMethodDto } from './dtos/create-bank.dto';
import { User } from '@decorators/user.decorator';
import { AccountEntity } from '@/users/entities/accounts';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '@decorators/auth.decorator';

@ApiBearerAuth()
@ApiTags('bank-accounts')
@Auth()
@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private bankAccountService: BankAccountsService) {}

  @Post()
  async CreateBankPaymentMethodDto(
    @Body() createBankPaymentDto: CreateBankPaymentMethodDto,
    @User() account: AccountEntity,
  ) {
    return this.bankAccountService.createBankPyamentMethod(
      createBankPaymentDto,
      account,
    );
  }
}
