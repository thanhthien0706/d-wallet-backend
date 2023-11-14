import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionEntity } from './entities/transaction';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@/users/users.module';
import { BalanceHistoriesModule } from '@/balance-histories/balance-histories.module';
import { TransactionManager } from '@/common/transaction-manager';
import { StripeModule } from '@/stripe/stripe.module';
import { CardsModule } from '@/cards/cards.module';
import { NotificationsModule } from '@/notifications/notifications.module';
import { FirebaseModule } from '@/firebase/firebase.module';
import { JwtModule } from '@nestjs/jwt';
import { SecondPasswordStrategy } from '@/auth/strategies/secondPassword.strategy';
import { LocalBanksModule } from '@/local-banks/local-banks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    UsersModule,
    BalanceHistoriesModule,
    CardsModule,
    forwardRef(() => StripeModule),
    NotificationsModule,
    FirebaseModule,
    JwtModule.register({}),
    LocalBanksModule
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionManager, SecondPasswordStrategy],
  exports: [TransactionsService],
})
export class TransactionsModule { }
