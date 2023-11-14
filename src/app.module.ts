import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { config } from '../ormconfig';
import { StripeModule } from './stripe/stripe.module';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { CardsModule } from './cards/cards.module';
import { LocalBanksModule } from './local-banks/local-banks.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BalanceHistoriesModule } from './balance-histories/balance-histories.module';
import { NotificationsModule } from './notifications/notifications.module';
import { FirebaseModule } from './firebase/firebase.module';
import {
  AcceptLanguageResolver,
  I18nJsonLoader,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { I18nLanguageModule } from './i18n-language/i18n-language.module';
import { readFileSync } from 'fs';
import { SettingsModule } from './settings/settings.module';
import { QrCodeModule } from './qr-code/qr-code.module';
import { StatisticsModule } from './statistics/statistics.module';
import { MailModule } from './mail/mail.module';
import { ResetPasswordCodeModule } from './reset-password-code/reset-password-code.module';
import { FilesModule } from './files/files.module';
import { Server } from 'http';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MULTER_DEST } from '@environments';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRoot(config),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/common/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '..', MULTER_DEST),
      exclude: ['/api/(.*)'],
      serveRoot: '/uploads',
      serveStaticOptions: {
        redirect: false,
        index: false,
      },
    }),
    UsersModule,
    AuthModule,
    CardsModule,
    StripeModule,
    TransactionsModule,
    BankAccountsModule,
    LocalBanksModule,
    BalanceHistoriesModule,
    NotificationsModule,
    FirebaseModule,
    I18nLanguageModule,
    SettingsModule,
    QrCodeModule,
    StatisticsModule,
    MailModule,
    ResetPasswordCodeModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
