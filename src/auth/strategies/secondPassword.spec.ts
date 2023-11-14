import { Test, TestingModule } from '@nestjs/testing';
import { SecondPasswordStrategy } from './secondPassword.strategy';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { NotFoundException } from '@nestjs/common';
import { SETTING_DEFAULT } from '@constants/setting-default';
import { async } from 'rxjs';

describe('Test second password strategy', () => {
  let secondPasswordStrategy: SecondPasswordStrategy;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        SecondPasswordStrategy,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    secondPasswordStrategy = moduleRef.get<SecondPasswordStrategy>(
      SecondPasswordStrategy,
    );
    jwtService = moduleRef.get<JwtService>(JwtService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  describe('validate', () => {
    it('Should return throw if not have amount in request body', async () => {
      const req = {
        body: {},
      } as Request;

      await expect(
        secondPasswordStrategy.validate(req, { sub: '123' }),
      ).rejects.toThrowError('Not Found Exception');
    });

    it('Should validation successfully  if amount is less than or equal to max amount check', async () => {
      const req: Request = {
        body: { amount: 10 },
      } as Request;

      const result = await secondPasswordStrategy.validate(req, {});

      expect(result).toEqual({});
    });

    it('Should throw error if tokensecondpassword is not provider', async () => {
      const req: Request = {
        body: { amount: SETTING_DEFAULT.CURRENCY.MAX_AMOUNT_CHECK + 1 },
        headers: {},
      } as Request;

      await expect(
        secondPasswordStrategy.validate(req, {}),
      ).rejects.toThrowError('Not Found Exception');
    });

    it('Should throw error if decodedSecondPassword.sub is not equal to payload.sub', async () => {
      const req = {
        body: { amount: SETTING_DEFAULT.CURRENCY.MAX_AMOUNT_CHECK + 1 },
        headers: {
          tokensecondpassword: 'mock-token',
        },
      } as unknown as Request;

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce({
        sub: 1,
      });

      await expect(
        secondPasswordStrategy.validate(req, { sub: 123 }),
      ).rejects.toThrow();
    });

    it('Should validation successfully if decodedSecondPassword.sub is equal to payload.sub', async () => {
      const req: Request = {
        body: {
          amount: SETTING_DEFAULT.CURRENCY.MAX_AMOUNT_CHECK + 1,
        },
        headers: {
          tokensecondpassword: 'mock-token',
        },
      } as unknown as Request;

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce({
        sub: 1,
      });

      const rs = await secondPasswordStrategy.validate(req, { sub: 1 });
      expect(rs).toEqual({});
    });

    it('Should throw an error if jwtservice  verifyAsync throws error', async () => {
      const req: Request = {
        body: {
          amount: SETTING_DEFAULT.CURRENCY.MAX_AMOUNT_CHECK + 1,
        },
        headers: {
          tokensecondpassword: 'mock-token',
        },
      } as unknown as Request;

      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValueOnce(new Error('Jwt verification failed'));

      await expect(secondPasswordStrategy.validate(req, {})).rejects.toThrow();
    });
  });
});
