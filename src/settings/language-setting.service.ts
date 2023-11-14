import { BaseService, Pagination } from '@/common/base.service';
import { Injectable } from '@nestjs/common';
import { LanguageSettingEntity } from './entities/language-setting';
import { CreateLanguageSettingDto } from './dto/create-language-setting.dto';
import { UpdateLanguageSettingDto } from './dto/update-language-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageName } from '@/message';
import { AccountEntity } from '@/users/entities/accounts';
import { SETTING_DEFAULT } from '@constants/setting-default';
import { ReturnLanguageSettingDto } from './dto/return-language-setting.dto';

@Injectable()
export class LanguageSettingService extends BaseService<
  LanguageSettingEntity,
  CreateLanguageSettingDto,
  UpdateLanguageSettingDto
> {
  constructor(
    @InjectRepository(LanguageSettingEntity)
    private languageSettingRepository: Repository<LanguageSettingEntity>,
  ) {
    super(MessageName.USER, languageSettingRepository);
  }

  findAll(
    filterDto?: any,
  ): Promise<LanguageSettingEntity[] | Pagination<LanguageSettingEntity>> {
    throw new Error('Method not implemented.');
  }

  async findByAccountId(accountId: number) {
    return await this.languageSettingRepository.findOne({
      where: {
        account: { id: accountId },
      },
    });
  }

  async getLanguageCode(accountId: number) {
    const inforLanguage = await this.findByAccountId(accountId);

    return inforLanguage?.languageKey || SETTING_DEFAULT.LANGUAGE.DEFAULT;
  }

  async checkUserLanguageExist(accountId: number) {
    let check = true;

    const language = await this.languageSettingRepository.findOneBy({
      account: { id: accountId },
    });

    !language && (check = false);

    return check;
  }

  async handleUpdateLanguageSetting(
    account: AccountEntity,
    languageKey: string,
  ) {
    const language = await this.languageSettingRepository.findOne({
      where: {
        account: { id: account.id },
      },
      relations: { account: true },
    });

    let languageModel: CreateLanguageSettingDto;

    if (!language) {
      languageModel = { account, languageKey };
    } else {
      languageModel = Object.assign(language, { languageKey });
    }

    let languageUpdate = await this.languageSettingRepository.save(
      languageModel,
    );

    const accountId = languageUpdate.account.id;
    delete languageUpdate.account;

    const rs: ReturnLanguageSettingDto = {
      ...languageUpdate,
      accountId,
    };

    return rs;
  }
}
