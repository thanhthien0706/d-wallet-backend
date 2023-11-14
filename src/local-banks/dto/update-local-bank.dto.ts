import { PartialType } from '@nestjs/swagger';
import { CreateLocalBankDto } from './create-local-bank.dto';

export class UpdateLocalBankDto extends PartialType(CreateLocalBankDto) {}
