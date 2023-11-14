import { Module, forwardRef } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardEntity } from './entities/card';
import { StripeModule } from '@/stripe/stripe.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CardEntity]),
    forwardRef(() => StripeModule),
  ],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}
