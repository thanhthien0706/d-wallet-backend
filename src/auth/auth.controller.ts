import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RefreshTokenGuard } from '@guards/refresh-token.guard';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import {
  CreateAuthDto,
  CreateFacebookAccount,
  CreateGoogleAccount,
} from './dto/auth.dto';
import { Auth } from '@decorators/auth.decorator';
import { User } from '@decorators/user.decorator';
import { AccountEntity } from '@/users/entities/accounts';
import { Serialize } from '@decorators/Serialize.decorator';
import { ReturnAuthDto } from './dto/return-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUserSocial } from '@/common/interfaces/request-with-user.interface';
import { Request } from 'express';
import { TokenVerificationDto } from './dto/token-verification.dto';
import { ReturnTokenDto } from './dto/return-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ReturnCodeForgotPassword } from './dto/return-code-forgotpassword.dto';
import { ResetCodeTokenGuard } from '@guards/reset-code-token.guard';
import { RequestWithAccountId } from '@/common/interfaces/request-with-accountId.interface';
import { ResetCodeDto } from './dto/reset-code.dto';
import { ReturnResetPasswordDto } from './dto/return-reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordTokenGuard } from '@guards/reset-password-token.guard';
import { ReturnAccountDto } from './dto/return-account.dto';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOkResponse({
    description: 'Signup',
    type: ReturnAuthDto,
  })
  @Serialize(ReturnAuthDto)
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  @ApiOkResponse({
    description: 'Signin',
    type: ReturnAuthDto,
  })
  @Serialize(ReturnAuthDto)
  signin(@Body() data: CreateAuthDto) {
    return this.authService.signIn(data);
  }

  @Auth()
  @Get('logout')
  logout(@User() user: AccountEntity) {
    this.authService.logout(user.id);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiOkResponse({
    description: 'Api refresh token',
    type: ReturnTokenDto,
  })
  refreshTokens(@User() user: AccountEntity) {
    const refreshToken = user.refreshToken;
    return this.authService.refreshTokens(user.id, refreshToken);
  }

  @Get('google')
  @ApiOkResponse({
    description: 'signin with google in web',
  })
  @UseGuards(AuthGuard('google'))
  googleAuth(@Req() req: Request) {}

  @Get('google/redirect')
  @ApiOkResponse({
    description: 'sigin wiht google in web success',
    type: ReturnAuthDto,
  })
  @UseGuards(AuthGuard('google'))
  @Serialize(ReturnAuthDto)
  googleAuthRedirect(@Req() req: RequestWithUserSocial) {
    req.userGG = req.user;
    return this.authService.googleLogin(req.userGG);
  }

  @Post('google-mobile')
  @ApiOkResponse({
    description: 'sigin wiht google in mobile',
    type: ReturnAuthDto,
  })
  @Serialize(ReturnAuthDto)
  googleAuthMobile(@Body() tokenData: TokenVerificationDto) {
    return this.authService.googleLoginMobile(tokenData.token);
  }

  @Get('facebook')
  @ApiOkResponse({
    description: 'signin with facebook in web',
  })
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Req() req: Request) {}

  @Get('facebook/redirect')
  @ApiOkResponse({
    description: 'sigin wiht facebook in web success',
    type: ReturnAuthDto,
  })
  @Serialize(ReturnAuthDto)
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Req() req: RequestWithUserSocial) {
    return this.authService.facebookLogin(req.userFb);
  }

  @Post('forgot-password')
  @ApiOkResponse({
    description: 'Forgot password',
    type: ReturnCodeForgotPassword,
  })
  @Serialize(ReturnCodeForgotPassword)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @UseGuards(ResetCodeTokenGuard)
  @Post('reset-code')
  @ApiHeader({ name: 'reset-code-token' })
  @ApiOkResponse({
    description: 'Check valid code',
    type: ReturnResetPasswordDto,
  })
  @Serialize(ReturnResetPasswordDto)
  async checkValidCode(
    @Req() req: RequestWithAccountId,
    @Body() resetCodeDto: ResetCodeDto,
  ) {
    return this.authService.checkValidCode(req.id, resetCodeDto.resetCode);
  }

  @UseGuards(ResetPasswordTokenGuard)
  @ApiHeader({ name: 'reset-password-token' })
  @ApiOkResponse({
    description: 'Change password',
    type: ReturnAccountDto,
  })
  @Post('reset-password')
  async changePassword(
    @Req() req: RequestWithAccountId,
    @Body() passwordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.id, passwordDto.password);
  }
}
