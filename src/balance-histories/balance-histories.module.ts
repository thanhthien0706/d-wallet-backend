import { Module } from '@nestjs/common';
import { BalanceHistoriesController } from './balance-histories.controller';
import { BalanceHistoriesService } from './balance-histories.service';
import { BalanceHistoriesEntity } from './entities/balance-history';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BalanceHistoriesEntity])],
  controllers: [BalanceHistoriesController],
  providers: [BalanceHistoriesService],
  exports: [BalanceHistoriesService],
})
export class BalanceHistoriesModule {}
