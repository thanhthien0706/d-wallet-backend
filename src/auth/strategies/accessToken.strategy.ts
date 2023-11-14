import { JWT_ACCESS_SECRET } from '@/common/environments';
import { LanguageSettingEntity } from '@/settings/entities/language-setting';
import { LanguageSettingService } from '@/settings/language-setting.service';
import { UsersService } from '@/users/users.service';
import { JwtPayload } from '@constants/jwt.payload';
import { SETTING_DEFAULT } from '@constants/setting-default';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private userSerivce: UsersService,
    private languageSettingService: LanguageSettingService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userSerivce.findById(+payload.sub);
    const language =
      (await this.languageSettingService.getLanguageCode(user.id)) ??
      SETTING_DEFAULT.LANGUAGE.DEFAULT;

    return { ...user, language };
  }
}
