import {
  CreateFacebookAccount,
  CreateGoogleAccount,
} from '@/auth/dto/auth.dto';
import { Request } from 'express';

export interface RequestWithUserSocial extends Request {
  userGG: CreateGoogleAccount;
  userFb: CreateFacebookAccount;
  user: any;
}
