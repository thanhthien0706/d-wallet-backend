import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_RESETCODE_SECRET } from '@environments';
import { RequestWithAccountId } from '../interfaces/request-with-accountId.interface';
import { DecodeResetCodeAnsPassToen } from '../interfaces/decode-reset-code-and-password-token';
import { BadRequestException } from '@exceptions/bad-request.exception';
import { TypeError } from '@enums/type-error';

@Injectable()
export class ResetPasswordTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithAccountId = context.switchToHttp().getRequest();
    const resetPasswordToken = request.headers['reset-password-token'];

    if (!resetPasswordToken) {
      throw new BadRequestException(TypeError.NOT_FOUND_RESET_PASSWORD_TOKEN);
    }

    let decodedResetPasswordToken: DecodeResetCodeAnsPassToen;
    try {
      decodedResetPasswordToken = await this.jwtService.verifyAsync(
        resetPasswordToken as string,
        {
          secret: JWT_RESETCODE_SECRET,
        },
      );
    } catch (error) {
      throw new BadRequestException(TypeError.RESET_PASSWORD_TOKEN_INVALID);
    }

    request.id = decodedResetPasswordToken.id;
    return true;
  }
}
