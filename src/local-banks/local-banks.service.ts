import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalBankEntity } from './entities/local-bank';
import { IsNull, Not, Repository } from 'typeorm';
import { BaseService, Pagination } from '@/common/base.service';
import { CreateLocalBankDto } from './dto/create-local-bank.dto';
import { UpdateLocalBankDto } from './dto/update-local-bank.dto';
import { MessageName } from '@/message';
import { AccountEntity } from '@/users/entities/accounts';
import { NotFoundException } from '@exceptions/not-found.exception';
import { FilterLocalBankDto } from './dto/filter-local-bank.dto';

@Injectable()
export class LocalBanksService extends BaseService<
  LocalBankEntity,
  CreateLocalBankDto,
  UpdateLocalBankDto
> {
  constructor(
    @InjectRepository(LocalBankEntity)
    private readonly localBankRepository: Repository<LocalBankEntity>,
  ) {
    super(MessageName.LOCALBANK, localBankRepository);
  }

  findAll(
    filterDto?: any,
  ): Promise<Pagination<LocalBankEntity> | LocalBankEntity[]> {
    throw new Error('Method not implemented.');
  }

  async findAllLocalBank(
    filterLocalBankDto: FilterLocalBankDto,
    account: AccountEntity,
  ): Promise<Pagination<LocalBankEntity>> {
    const [data, total] = await this.localBankRepository.findAndCount({
      take: filterLocalBankDto.limit,
      skip: filterLocalBankDto.skip,
      order: filterLocalBankDto.order,
      where: {
        account: {
          id: account.id,
        },
      },
    });

    return {
      data,
      total,
    };
  }

  async findAllLocalBankSoftRemove(
    filterLocalBankDto: FilterLocalBankDto,
    account: AccountEntity,
  ): Promise<Pagination<LocalBankEntity>> {
    const [data, total] = await this.localBankRepository.findAndCount({
      take: filterLocalBankDto.limit,
      skip: filterLocalBankDto.skip,
      order: filterLocalBankDto.order,
      where: {
        account: {
          id: account.id,
        },
        deletedAt: Not(IsNull()),
      },
      withDeleted: true,
    });

    return {
      data,
      total,
    };
  }

  createLocalBank(
    createLocalBankDto: CreateLocalBankDto,
    account: AccountEntity,
  ) {
    const localBank = this.localBankRepository.create(createLocalBankDto);
    localBank.account = account;
    return this.localBankRepository.save(localBank);
  }

  async softRemoveLocalBank(localBankId: number, account: AccountEntity) {
    const localbank = await this.localBankRepository.findOne({
      where: {
        account: {
          id: account.id,
        },
      },
    });

    if (!localbank) {
      throw new NotFoundException(MessageName.LOCALBANK);
    }
    await this.localBankRepository.softDelete(localBankId);
    return localbank;
  }

  async restoreLocalbank(localBankId: number, account: AccountEntity) {
    const findLocalBankSoftRemove = await this.localBankRepository.findOne({
      where: {
        id: localBankId,
        account: {
          id: account.id,
        },
      },
      withDeleted: true,
    });

    if (!findLocalBankSoftRemove) {
      throw new NotFoundException(MessageName.LOCALBANK);
    }
    await this.localBankRepository.restore(localBankId);

    return findLocalBankSoftRemove;
  }

  /**
   * TODO:
   * This function handle transfer bank from owner local bank to cusotmer localbank
   * This need exceute after money have send from stripe to owner bank account
   */
  handleTransferToLocalbank() {}
}
