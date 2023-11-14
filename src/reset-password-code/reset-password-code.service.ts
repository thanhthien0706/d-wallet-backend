import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetCodeEntity } from './entity/reset-code.entity';
import { Repository } from 'typeorm';
import { AccountEntity } from '@/users/entities/accounts';
import { OrderType } from '@enums/order';
import { EXPIRES_TIME_RESET_CODE } from '@constants/time';
import { BadRequestException } from '@exceptions/bad-request.exception';
import { TypeError } from '@enums/type-error';

@Injectable()
export class ResetPasswordCodeService {
  constructor(
    @InjectRepository(ResetCodeEntity)
    private readonly resetCodeRepository: Repository<ResetCodeEntity>,
  ) {}

  saveResetCode(
    code: string,
    account: AccountEntity,
  ): Promise<ResetCodeEntity> {
    return this.resetCodeRepository.save({ account, code });
  }

  async getLatestResetCodeByAccount(account: AccountEntity) {
    const resetCode = await this.resetCodeRepository.findOne({
      where: {
        account: {
          id: account.id,
        },
      },
      order: {
        createdAt: OrderType.DESC,
      },
    });

    return resetCode;
  }

  async checkValidResetCode(account: AccountEntity, code: string) {
    const findResetCode = await this.getLatestResetCodeByAccount(account);
    if (!findResetCode) {
      throw new BadRequestException(TypeError.NOT_FOUND_RESET_CODE_TOKEN);
    }

    if (findResetCode.code !== code) {
      return false;
    }

    return true;
  }

  /* Check that latest resetcode is expires or not
   *  If not return false to prevent user create another request to create reset code
   *  Otherwise return true and allow user create another reset code
   */
  async isLatestResetCodeExpire(account: AccountEntity) {
    const recentResetCode = await this.getLatestResetCodeByAccount(account);

    if (
      recentResetCode &&
      Date.now() - recentResetCode.createdAt.getTime() < EXPIRES_TIME_RESET_CODE
    ) {
      return false;
    }

    return true;
  }
}
