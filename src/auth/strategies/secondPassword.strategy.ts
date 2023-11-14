import { JWT_ACCESS_SECRET } from '@environments';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import BigNumber from 'bignumber.js';
import { SETTING_DEFAULT } from '@constants/setting-default';
import { IncorrectException } from '@exceptions/incorrect.exception';
import { MessageName } from '@/message';
import { NotFoundException } from '@exceptions/not-found.exception';
import { JWT_TYPE } from '@constants/jwt.type';
import { SecondPasswordTokenInvalidException } from '@exceptions/second-password-token-invalid.exception';
import { JwtPayload } from '@constants/jwt.payload';

@Injectable()
export class SecondPasswordStrategy extends PassportStrategy(
  Strategy,
  'second-password',
) {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_ACCESS_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const { amount } = req.body;
    if (!amount) throw new NotFoundException(MessageName.AMOUNT);

    const rsCompareNumber = BigNumber(amount).isGreaterThan(
      BigNumber(SETTING_DEFAULT.CURRENCY.MAX_AMOUNT_CHECK),
    );

    if (rsCompareNumber) {
      const { tokensecondpassword } = req.headers;

      if (!tokensecondpassword)
        throw new NotFoundException(MessageName.TOKEN_SECOND_PASSWORD);

      let decodedSecondPassword: JwtPayload;

      try {
        decodedSecondPassword = await this.jwtService.verifyAsync(
          tokensecondpassword as string,
          {
            secret: this.configService.get<string>(
              JWT_TYPE.JWT_SECOND_PASSWORD,
            ),
          },
        );
      } catch (error) {
        throw new SecondPasswordTokenInvalidException();
      }

      if (!decodedSecondPassword || decodedSecondPassword.sub !== payload.sub)
        throw new IncorrectException(MessageName.TOKEN_SECOND_PASSWORD);
    }

    return {};
  }
}
