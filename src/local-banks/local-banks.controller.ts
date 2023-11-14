import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { LocalBanksService } from './local-banks.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '@decorators/auth.decorator';
import { User } from '@decorators/user.decorator';
import { AccountEntity } from '@/users/entities/accounts';
import { CreateLocalBankDto } from './dto/create-local-bank.dto';
import { ReturnLocalBankDto } from './dto/return-local-bank.dto';
import { UpdateLocalBankDto } from './dto/update-local-bank.dto';
import { Serialize } from '@decorators/Serialize.decorator';
import { ReturnPaginationLocalBankDto } from './dto/return-pagination-local-bank.dto';
import { FilterLocalBankDto } from './dto/filter-local-bank.dto';

@ApiTags('local-bank')
@ApiBearerAuth()
@Auth()
@Controller('local-banks')
export class LocalBanksController {
  constructor(private readonly localBankService: LocalBanksService) {}

  @ApiOkResponse({
    description: 'Create local bank',
    type: ReturnLocalBankDto,
  })
  @Post()
  @Serialize(ReturnLocalBankDto)
  createLocalBank(
    @Body() creatLocalBankDto: CreateLocalBankDto,
    @User() account: AccountEntity,
  ) {
    return this.localBankService.createLocalBank(creatLocalBankDto, account);
  }

  @ApiOkResponse({
    description: 'Update local bank',
    type: ReturnLocalBankDto,
  })
  @Patch('/:id')
  @Serialize(ReturnLocalBankDto)
  updateLocalBank(
    @Param('id') id: number,
    @Body() updateLocalBankDto: UpdateLocalBankDto,
  ) {
    return this.localBankService.update(id, updateLocalBankDto);
  }

  @ApiOkResponse({
    description: 'remove local bank',
    type: ReturnLocalBankDto,
  })
  @Serialize(ReturnLocalBankDto)
  @Delete('/:id')
  removeLocalBank(@Param('id') id: number, @User() account: AccountEntity) {
    return this.localBankService.softRemoveLocalBank(id, account);
  }

  @ApiOkResponse({
    description: 'restore local bank',
    type: ReturnLocalBankDto,
  })
  @Serialize(ReturnLocalBankDto)
  @Patch('/restore/:id')
  restoreLocalbank(@Param('id') id: number, @User() account: AccountEntity) {
    return this.localBankService.restoreLocalbank(id, account);
  }

  @ApiOkResponse({
    description: 'Find all local bank',
    type: ReturnPaginationLocalBankDto,
  })
  @Get('/findallLocalbank')
  @Serialize(ReturnPaginationLocalBankDto)
  async findAllLocalBank(
    @Query() filterLocalBankDto: FilterLocalBankDto,
    @User() account: AccountEntity,
  ) {
    return this.localBankService.findAllLocalBank(filterLocalBankDto, account);
  }

  @ApiOkResponse({
    description: 'Find all local bank remove',
    type: ReturnPaginationLocalBankDto,
  })
  @Get('/findallLocalbankremove')
  @Serialize(ReturnPaginationLocalBankDto)
  async findAllLocalBankRemove(
    @Query() filterLocalBankDto: FilterLocalBankDto,
    @User() account: AccountEntity,
  ) {
    return this.localBankService.findAllLocalBankSoftRemove(
      filterLocalBankDto,
      account,
    );
  }
}
