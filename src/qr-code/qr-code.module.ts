import { Module } from '@nestjs/common';
import { QrCodeService } from './qr-code.service';
import { QrCodeController } from './qr-code.controller';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [QrCodeService],
  controllers: [QrCodeController],
})
export class QrCodeModule {}
