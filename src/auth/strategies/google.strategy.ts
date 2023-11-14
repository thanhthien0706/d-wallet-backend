import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '@environments';
import { CreateGoogleAccount } from '../dto/auth.dto';
import { TypeAuth } from '@constants/type-auth';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:${process.env.APP_PORT}/api/auth/${process.env.GG_CALLBACK_URL}`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshTOken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<CreateGoogleAccount> {
    const { name, emails } = profile;
    const user: CreateGoogleAccount = {
      email: emails[0].value,
      name: name.givenName,
      typeAuth: TypeAuth.GOOGLE,
    };

    return user;
  }
}
