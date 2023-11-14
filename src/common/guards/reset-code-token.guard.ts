import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_RESETPASSWORD_SECRET } from '@environments';
import { RequestWithAccountId } from '../interfaces/request-with-accountId.interface';
import { DecodeResetCodeAnsPassToen } from '../interfaces/decode-reset-code-and-password-token';
import { BadRequestException } from '@exceptions/bad-request.exception';
import { TypeError } from '@enums/type-error';

@Injectable()
export class ResetCodeTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithAccountId = context.switchToHttp().getRequest();
    const resetCodeToken = request.headers['reset-code-token'];

    if (!resetCodeToken) {
      throw new BadRequestException(TypeError.NOT_FOUND_RESET_CODE_TOKEN);
    }

    let decodedResetCodeToken: DecodeResetCodeAnsPassToen;
    try {
      decodedResetCodeToken = await this.jwtService.verifyAsync(
        resetCodeToken as string,
        {
          secret: JWT_RESETPASSWORD_SECRET,
        },
      );
    } catch (error) {
      throw new BadRequestException(TypeError.RESET_CODE_TOKEN_INVALID);
    }

    request.id = decodedResetCodeToken.id;
    return true;
  }
}
