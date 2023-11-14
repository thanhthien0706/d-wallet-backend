import { Module } from '@nestjs/common';
import { LocalBanksController } from './local-banks.controller';
import { LocalBanksService } from './local-banks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalBankEntity } from './entities/local-bank';

@Module({
  imports: [TypeOrmModule.forFeature([LocalBankEntity])],
  controllers: [LocalBanksController],
  providers: [LocalBanksService],
  exports: [LocalBanksService],
})
export class LocalBanksModule {}
