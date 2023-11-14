import { BaseService, Pagination } from '@/common/base.service';
import { Injectable } from '@nestjs/common';
import { BalanceHistoriesEntity } from './entities/balance-history';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageName } from '@/message';
import { StatusType } from '@enums/status';
import { TransactionEntity } from '@/transactions/entities/transaction';
import { checkAmount } from '@/utils/amount-handle';

@Injectable()
export class BalanceHistoriesService extends BaseService<
  BalanceHistoriesEntity,
  CreateBalanceDto,
  UpdateBalanceDto
> {
  constructor(
    @InjectRepository(BalanceHistoriesEntity)
    private readonly balanceRepository: Repository<BalanceHistoriesEntity>,
  ) {
    super(MessageName.USER, balanceRepository);
  }

  findAll(
    filterDto?: any,
  ): Promise<BalanceHistoriesEntity[] | Pagination<BalanceHistoriesEntity>> {
    throw new Error('Method not implemented.');
  }

  async createWithTransaction(
    createBalanceDto: CreateBalanceDto,
    entityManager: EntityManager,
  ) {
    return await entityManager.save(BalanceHistoriesEntity, createBalanceDto);
  }

  async getBalanceLatest(accountId: number) {
    return await this.balanceRepository.findOne({
      where: {
        account: { id: accountId },
        status: StatusType.COMPLETED,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async _checkBalanceEnough(accountId: number, amount: string) {
    const balance = await this.getBalanceLatest(accountId);

    return checkAmount(balance.value, amount);
  }

  async checkBalanceEnough(accountId: number, amount: number) {
    const balance = await this.getBalanceLatest(accountId);
    let check = true;

    if (+balance.value < amount) {
      check = false;
    }

    return check;
  }

  async findBalanceHistoryByTransaction(transaction: TransactionEntity) {
    return this.balanceRepository.findOne({
      where: {
        transaction: {
          id: transaction.id,
        },
      },
      relations: {
        transaction: true,
        account: true,
      },
    });
  }

  async saveBalanceHistory(balanceHistory: BalanceHistoriesEntity) {
    return this.balanceRepository.save(balanceHistory);
  }

  async removeBalanceHistory(balanceHistory: BalanceHistoriesEntity) {
    return this.balanceRepository.remove(balanceHistory);
  }
}
