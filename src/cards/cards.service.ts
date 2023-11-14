import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from './entities/card';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateCardDto } from './dtos/create-card.dto';
import { AccountEntity } from '@/users/entities/accounts';
import { StripeService } from '@/stripe/stripe.service';
import Stripe from 'stripe';
import { NotFoundException } from '@exceptions/not-found.exception';
import { MessageName } from '@/message';
import { FilterCardDto } from './dtos/filter-card.dto';
import { Pagination } from '@/common/base.service';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(CardEntity)
    private cardRepository: Repository<CardEntity>,
    @Inject(forwardRef(() => StripeService))
    private stripeService: StripeService,
  ) {}

  async findCardMethodById(cardId: number) {
    const cardMethod = await this.cardRepository.findOne({
      where: {
        id: cardId,
      },
    });

    if (!cardMethod) {
      throw new NotFoundException(MessageName.CARD);
    }

    return cardMethod;
  }

  async createCardPayment(
    createCardDto: CreateCardDto,
    account: AccountEntity,
  ) {
    const { tokenStripe } = account;

    const paymentMethod: Stripe.PaymentMethod =
      await this.stripeService.createCardPayment(createCardDto);

    const attachPaymentToAccount =
      await this.stripeService.attachPaymentToAccount(
        paymentMethod,
        tokenStripe,
      );
    return this.cardRepository.save({
      account,
      token: attachPaymentToAccount.id,
      brand: attachPaymentToAccount.card.brand,
      country: attachPaymentToAccount.card.country,
      codeLast4: attachPaymentToAccount.card.last4,
      expYear: `${attachPaymentToAccount.card.exp_year}`,
      expMonth: `${attachPaymentToAccount.card.exp_month}`,
    });
  }

  async findAllCardPayment(
    filterCardPayment: FilterCardDto,
    account: AccountEntity,
  ): Promise<Pagination<CardEntity>> {
    const [data, total] = await this.cardRepository.findAndCount({
      take: filterCardPayment.limit,
      skip: filterCardPayment.skip,
      order: filterCardPayment.order,
      where: {
        account: {
          id: account.id,
        },
      },
    });

    return {
      data,
      total,
    };
  }

  async findAllCardPaymentSoftRemove(
    filterCardPayment: FilterCardDto,
    account: AccountEntity,
  ): Promise<Pagination<CardEntity>> {
    const [data, total] = await this.cardRepository.findAndCount({
      take: filterCardPayment.limit,
      skip: filterCardPayment.skip,
      order: filterCardPayment.order,
      where: {
        account: {
          id: account.id,
        },
        deletedAt: Not(IsNull()),
      },
      withDeleted: true,
    });

    return {
      data,
      total,
    };
  }

  async removeCardPayment(cardId: number, account: AccountEntity) {
    const cardPayment = await this.cardRepository.findOne({
      where: {
        id: cardId,
        account: {
          id: account.id,
        },
      },
    });

    if (!cardPayment) {
      throw new NotFoundException(MessageName.CARD);
    }

    await this.cardRepository.softDelete(cardId);
    return cardPayment;
  }

  async restoreCardPayment(cardId: number, account: AccountEntity) {
    const findCardRemove = await this.cardRepository.findOne({
      where: {
        id: cardId,
        account: {
          id: account.id,
        },
      },
      withDeleted: true,
    });

    if (!findCardRemove) {
      throw new NotFoundException(MessageName.CARD);
    }

    const restoreCard = await this.cardRepository.restore(cardId);
    if (!restoreCard.affected) {
      throw new NotFoundException(MessageName.CARD);
    }

    return findCardRemove;
  }
}
