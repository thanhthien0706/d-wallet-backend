import { BaseService, Pagination } from '@/common/base.service';
import { MessageName } from '@/message';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccountEntity } from './entities/accounts';
import { UserProfileService } from './user-profile.service';
import { BalanceHistoriesService } from '@/balance-histories/balance-histories.service';
import { JwtService } from '@nestjs/jwt';
import { JWT_TYPE } from '@constants/jwt.type';
import { ConfigService } from '@nestjs/config';
import { IncorrectException } from '@exceptions/incorrect.exception';
import { NotFoundException } from '@exceptions/not-found.exception';

@Injectable()
export class UsersService extends BaseService<
  AccountEntity,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    private userProfileService: UserProfileService,
    private balanceService: BalanceHistoriesService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super(MessageName.USER, accountRepository);
  }

  async createAccountWithTransaction<T>(
    createUserDto: T,
    manager: EntityManager,
  ) {
    return await manager.save(AccountEntity, createUserDto);
  }

  async createAccount<T>(createUserDto: T): Promise<AccountEntity> {
    return await this.accountRepository.save(createUserDto);
  }

  async createAccountWithInfor(
    createUserDto: CreateUserDto,
    entityManager: EntityManager,
  ) {
    return await entityManager.create(AccountEntity, createUserDto);
  }

  async findAll(
    filterUserDto: FilterUserDto,
  ): Promise<Pagination<AccountEntity>> {
    const [data, total] = await this.accountRepository.findAndCount({
      take: filterUserDto.limit,
      skip: filterUserDto.skip,
      order: filterUserDto.order,
    });
    return {
      data,
      total,
    };
  }

  async findByEmail(email: string): Promise<AccountEntity> {
    return await this.accountRepository.findOneBy({ email });
  }

  async searchUserByNameAndEmail(
    conditionText: string,
    filterUserDto: FilterUserDto,
  ): Promise<Pagination<any>> {
    const keyWord = `%${conditionText.toLowerCase()}%`;
    const { limit, order, skip } = filterUserDto;

    const [accounts, total] = await this.accountRepository.findAndCount({
      where: [
        {
          name: ILike(keyWord),
        },
        {
          email: ILike(keyWord),
        },
        {
          userProfile: { phone: ILike(keyWord) },
        },
      ],
      relations: {
        userProfile: true,
      },
      take: limit,
      skip,
      order,
    });

    if (!accounts) throw new NotFoundException(MessageName.USER);

    const userInfors = accounts.map((account) => {
      return {
        ...account,
        ...account.userProfile,
      };
    });

    return {
      data: userInfors,
      total,
    };
  }

  async getProfileUser(accountId: number) {
    const accountPromise = this.accountRepository.findOneBy({ id: accountId });
    const userInforPromise = this.userProfileService.findProfileByAccountId(
      accountId,
      true,
    );

    const [account, userInfor] = await Promise.all([
      accountPromise,
      userInforPromise,
    ]);

    return {
      ...account,
      ...userInfor,
    };
  }

  async checkEmailExist(email: string) {
    const emailExist = await this.accountRepository.exist({
      where: { email },
    });

    return !!emailExist;
  }

  async updateFcmToken(notificationToken: string, account: AccountEntity) {
    account.notificationToken = notificationToken;
    return this.accountRepository.save(account);
  }

  async checkSecondPassword(accountId: number, secondPassword: string) {
    const newAccount = await this.accountRepository.findOneBy({
      id: accountId,
    });

    const checkPass = newAccount.compareSecondPassword(secondPassword);
    if (!checkPass) throw new IncorrectException(MessageName.SECOND_PASSWORD);

    const token = await this.jwtService.signAsync(
      {
        sub: newAccount.id,
        email: newAccount.email,
      },
      {
        secret: this.configService.get<string>(JWT_TYPE.JWT_SECOND_PASSWORD),
        expiresIn: '6m',
      },
    );

    return {
      tokenSecondPassword: token,
    };
  }

  async findOneUserAndProfile(userId: number) {
    return await this.accountRepository.findOne({
      select: ['id', 'createdAt', 'deletedAt', 'email', 'name'],
      where: {
        id: userId,
      },
      relations: { userProfile: true },
    });
  }
}
