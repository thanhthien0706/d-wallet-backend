import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { StripeModule } from '@/stripe/stripe.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { FackebookStrategy } from './strategies/facebook.strategy';
import { TransactionManager } from '@/common/transaction-manager';
import { BalanceHistoriesModule } from '@/balance-histories/balance-histories.module';
import { SettingsModule } from '@/settings/settings.module';
import { SecondPasswordStrategy } from './strategies/secondPassword.strategy';
import { MailModule } from '@/mail/mail.module';
import { ResetPasswordCodeModule } from '@/reset-password-code/reset-password-code.module';

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule,
    StripeModule,
    BalanceHistoriesModule,
    SettingsModule,
    MailModule,
    ResetPasswordCodeModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
    FackebookStrategy,
    TransactionManager,
    SecondPasswordStrategy,
  ],
})
export class AuthModule {}
