import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

import { FACEBOOK_ID, FACEBOOK_SECRET } from '@environments';
import { CreateFacebookAccount } from '../dto/auth.dto';
import { TypeAuth } from '@constants/type-auth';

@Injectable()
export class FackebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: FACEBOOK_ID,
      clientSecret: FACEBOOK_SECRET,
      callbackURL: `http://localhost:${process.env.APP_PORT}/api/auth/${process.env.FB_CALLBACK_URL}`,
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<CreateFacebookAccount> {
    const { emails, name } = profile;
    const user: CreateFacebookAccount = {
      email: emails[0].value,
      name: name.givenName,
      typeAuth: TypeAuth.FACEBOOK,
    };

    return user;
  }
}
