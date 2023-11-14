import { Auth } from '@decorators/auth.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { User } from '@decorators/user.decorator';
import { AccountEntity } from './entities/accounts';
import { UserProfileService } from './user-profile.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ReturnUserProfileDto } from './dto/return-user-profile.dto';
import { Serialize } from '@decorators/Serialize.decorator';
import { ReturnSearchUserDto } from './dto/return-search-user.dto';
import { UpdateFcmToken } from './dto/update-fcmtoken.dto';
import { ReturnAccountDto } from '@/auth/dto/return-account.dto';
import { UserInforValidate } from './dto/user-infor-validate.dto';
import { SecondPasswordDto } from './dto/second-password.dto';
import * as bcrypt from 'bcrypt';
import { ReturnCheckSecondPasswordDto } from './dto/return-check-second-password.dto';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userProfileService: UserProfileService,
  ) {}

  @Auth()
  @Patch('second-password')
  @ApiOkResponse({
    description: 'Update second password',
    type: AccountEntity,
  })
  @Serialize(AccountEntity)
  async updateSecondPassword(
    @Body() { secondPassword }: SecondPasswordDto,
    @User() account: UserInforValidate,
  ) {
    return this.usersService.update(account.id, {
      secondPassword: bcrypt.hashSync(secondPassword, 10),
    });
  }

  @Auth()
  @Post('check-second-password')
  @ApiOkResponse({
    description:
      'Api check second password. If the password is correct, the tokenSecondPassword will be returned. Use this token assigned to the request header in the transfer api to authenticate the transaction.',
    type: ReturnCheckSecondPasswordDto,
  })
  checkSecondPassword(
    @User() account: AccountEntity,
    @Body() { secondPassword }: SecondPasswordDto,
  ) {
    return this.usersService.checkSecondPassword(account.id, secondPassword);
  }

  @Get('check-email')
  @ApiOkResponse({
    description: 'Check email exist',
    type: Boolean,
  })
  checkEmail(@Query('email') email: string) {
    return this.usersService.checkEmailExist(email);
  }

  @Auth()
  @Get('profile')
  @Serialize(ReturnUserProfileDto)
  @ApiOkResponse({
    description: 'Get user profile',
    type: ReturnUserProfileDto,
  })
  getInforUser(@User() account: AccountEntity) {
    return this.usersService.getProfileUser(account.id);
  }

  @Auth()
  @Get('search')
  @Serialize(ReturnSearchUserDto)
  @ApiOkResponse({
    description: 'Search user by email and name',
    type: ReturnSearchUserDto,
  })
  async searchUser(
    @Query('text') text: string,
    @Query() filterUserDto: FilterUserDto,
  ) {
    const data = await this.usersService.searchUserByNameAndEmail(
      text ?? '',
      filterUserDto,
    );
    return data;
  }

  @Auth()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Auth()
  @Get()
  findAll(@Query() filterUserDto: FilterUserDto) {
    return this.usersService.findAll(filterUserDto);
  }

  @Auth()
  @Post('user_profile')
  @Serialize(ReturnUserProfileDto)
  @ApiOkResponse({
    description: 'Create user profile',
    type: ReturnUserProfileDto,
  })
  createUserProfile(
    @Body() createUserProfileDto: CreateUserProfileDto,
    @User() account: AccountEntity,
  ) {
    return this.userProfileService.createUserProfile(
      createUserProfileDto,
      account,
    );
  }

  @Auth()
  @Patch('user_profile')
  @Serialize(ReturnUserProfileDto)
  @ApiOkResponse({
    description: 'update user profile',
    type: ReturnUserProfileDto,
  })
  updateUserProfile(
    @User() account: AccountEntity,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.userProfileService.updateUserProfile(
      account.id,
      updateUserProfileDto,
    );
  }

  @Auth()
  @Patch('account/fcmtoken')
  @Serialize(ReturnAccountDto)
  @ApiOkResponse({
    description: 'update fcm token',
    type: ReturnAccountDto,
  })
  updateFcmToken(
    @Body() updateFcmToken: UpdateFcmToken,
    @User() account: AccountEntity,
  ) {
    return this.usersService.updateFcmToken(
      updateFcmToken.notificationToken,
      account,
    );
  }

  @Auth()
  @Get(':id')
  findById(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  @Auth()
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Auth()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
