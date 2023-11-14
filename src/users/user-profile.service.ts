import { BaseService, Pagination } from '@/common/base.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserProfilesEntity } from './entities/user-profiles';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageName } from '@/message';
import { AccountEntity } from './entities/accounts';
import { NotFoundException } from '@exceptions/not-found.exception';

@Injectable()
export class UserProfileService extends BaseService<
  UserProfilesEntity,
  CreateUserProfileDto,
  UpdateUserProfileDto
> {
  constructor(
    @InjectRepository(UserProfilesEntity)
    private userProfilesRepository: Repository<UserProfilesEntity>,
  ) {
    super(MessageName.USER, userProfilesRepository);
  }

  findAll(
    filterDto?: any,
  ): Promise<UserProfilesEntity[] | Pagination<UserProfilesEntity>> {
    throw new Error('Method not implemented.');
  }

  async createWithTransaction(
    createDto: CreateUserProfileDto,
    entityManager: EntityManager,
  ): Promise<UserProfilesEntity> {
    return await entityManager.save(UserProfilesEntity, createDto);
  }

  async createUserProfile(
    createUserProfileDto: CreateUserProfileDto,
    account: AccountEntity,
  ) {
    const userProfile = await this.userProfilesRepository.findOne({
      where: {
        account: {
          id: account.id,
        },
      },
      relations: {
        account: true,
      },
    });

    if (!userProfile) {
      throw new InternalServerErrorException();
    }

    Object.assign(userProfile, createUserProfileDto);
    return this.userProfilesRepository.save(userProfile);
  }

  async updateUserProfile(
    id: number,
    updateUserProfileDto: UpdateUserProfileDto,
  ) {
    const userProfiletoUpdate = await this.userProfilesRepository.findOne({
      where: { id },
    });

    if (!userProfiletoUpdate) {
      throw new NotFoundException(MessageName.USER);
    }

    Object.assign(userProfiletoUpdate, updateUserProfileDto);
    return this.userProfilesRepository.save(userProfiletoUpdate);
  }

  async findProfileByAccountId(
    accountId: number,
    cache: boolean,
  ): Promise<UserProfilesEntity> {
    return this.userProfilesRepository.findOne({
      where: {
        account: { id: accountId },
      },
      cache,
    });
  }
}
