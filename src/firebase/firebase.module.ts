import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseController } from './firebase.controller';
import { SettingsModule } from '@/settings/settings.module';

@Module({
  imports: [SettingsModule],
  providers: [FirebaseService],
  controllers: [FirebaseController],
  exports: [FirebaseService],
})
export class FirebaseModule {}
