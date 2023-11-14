import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dtos/create-card.dto';
import { Auth } from '@decorators/auth.decorator';
import { User } from '@decorators/user.decorator';
import { AccountEntity } from '@/users/entities/accounts';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Serialize } from '@decorators/Serialize.decorator';
import { ReturnCardDto } from './dtos/return-card.dto';
import { FilterCardDto } from './dtos/filter-card.dto';
import { ReturnPaginationCardDto } from './dtos/return-pagination-card.dto';

@ApiBearerAuth()
@ApiTags('cards')
@Auth()
@Controller('cards')
export class CardsController {
  constructor(private cardService: CardsService) {}

  @ApiOkResponse({
    description: 'Create card',
    type: ReturnCardDto,
  })
  @Post()
  @Serialize(ReturnCardDto)
  async creatCardPayment(
    @Body() creatCardto: CreateCardDto,
    @User() account: AccountEntity,
  ) {
    return this.cardService.createCardPayment(creatCardto, account);
  }

  @ApiOkResponse({
    description: 'Find all card',
    type: ReturnPaginationCardDto,
  })
  @Serialize(ReturnPaginationCardDto)
  @Get('/findAllCard')
  async findAllCardPayment(
    @Query() filterCardDto: FilterCardDto,
    @User() account: AccountEntity,
  ) {
    return this.cardService.findAllCardPayment(filterCardDto, account);
  }

  @ApiOkResponse({
    description: 'Find all card remove ',
    type: ReturnPaginationCardDto,
  })
  @Serialize(ReturnPaginationCardDto)
  @Get('/findAllCardRemove')
  async findAllCardPaymentRemove(
    @Query() filterCardDto: FilterCardDto,
    @User() account: AccountEntity,
  ) {
    return this.cardService.findAllCardPaymentSoftRemove(
      filterCardDto,
      account,
    );
  }

  @ApiOkResponse({
    description: 'remove card',
    type: ReturnCardDto,
  })
  @Serialize(ReturnCardDto)
  @Delete('/:cardId')
  async removeCardPayment(
    @Param('cardId') cardId: number,
    @User() account: AccountEntity,
  ) {
    return this.cardService.removeCardPayment(cardId, account);
  }

  @ApiOkResponse({
    description: 'restore card',
    type: ReturnCardDto,
  })
  @Serialize(ReturnCardDto)
  @Patch('/restore/:cardId')
  async restoreCardPayment(
    @Param('cardId') cardId: number,
    @User() account: AccountEntity,
  ) {
    return this.cardService.restoreCardPayment(cardId, account);
  }
}
