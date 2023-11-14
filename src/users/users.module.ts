import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserProfilesEntity } from './entities/user-profiles';
import { AccountEntity } from './entities/accounts';
import { UserProfileService } from './user-profile.service';
import { BalanceHistoriesModule } from '@/balance-histories/balance-histories.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProfilesEntity, AccountEntity]),
    BalanceHistoriesModule,
    JwtModule.register({}),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserProfileService],
  exports: [UsersService, UserProfileService],
})
export class UsersModule {}
