import { Module } from '@nestjs/common';
import { ResetPasswordCodeService } from './reset-password-code.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetCodeEntity } from './entity/reset-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResetCodeEntity])],
  providers: [ResetPasswordCodeService],
  exports: [ResetPasswordCodeService],
})
export class ResetPasswordCodeModule {}
