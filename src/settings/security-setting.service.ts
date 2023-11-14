import { BaseService, Pagination } from '@/common/base.service';
import { Injectable } from '@nestjs/common';
import { SecuritySettingEntity } from './entities/security-setting';
import { CreateSecuritySettingDto } from './dto/create-security-setting.dto';
import { UpdateSecuritySettingDto } from './dto/update-security-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageName } from '@/message';
import { AccountEntity } from '@/users/entities/accounts';

@Injectable()
export class SecuritySettingService extends BaseService<
  SecuritySettingEntity,
  CreateSecuritySettingDto,
  UpdateSecuritySettingDto
> {
  constructor(
    @InjectRepository(SecuritySettingEntity)
    private readonly securitySettingRepository: Repository<SecuritySettingEntity>,
  ) {
    super(MessageName.USER, securitySettingRepository);
  }

  findAll(
    filterDto?: any,
  ): Promise<SecuritySettingEntity[] | Pagination<SecuritySettingEntity>> {
    throw new Error('Method not implemented.');
  }

  async getSecuritySetting(account: AccountEntity) {
    let securitySetting = await this.securitySettingRepository.findOne({
      where: {
        account: { id: account.id },
      },
      relations: {
        account: true,
      },
    });

    !securitySetting &&
      (securitySetting = await this.createSecuritySetting({
        account,
        is2FA: false,
      }));

    const accountId = securitySetting.account.id;
    delete securitySetting.account.id;
    return {
      ...securitySetting,
      accountId,
    };
  }

  async createSecuritySetting(
    createSecuritySettingDto: CreateSecuritySettingDto,
  ) {
    return await this.securitySettingRepository.save(createSecuritySettingDto);
  }
}
