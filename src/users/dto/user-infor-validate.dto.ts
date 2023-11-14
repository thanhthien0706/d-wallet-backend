import { IsString } from 'class-validator';
import { AccountEntity } from '../entities/accounts';
import { Expose } from 'class-transformer';

export class UserInforValidate extends AccountEntity {
  @Expose()
  @IsString()
  language: string;
}
