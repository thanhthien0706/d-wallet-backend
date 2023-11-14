import { UserInforValidate } from '@/users/dto/user-infor-validate.dto';
import { UsersService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';
import { ReturnScanTransferDto } from './dto/return-scan-transfer.dto';
import * as QRCode from 'qrcode';

@Injectable()
export class QrCodeService {
  constructor(private readonly userService: UsersService) {}
  async handleScanToTransfer(account: UserInforValidate, amount: number = 0) {
    const userInfor = await this.userService.findOneUserAndProfile(account.id);

    const dataQr: ReturnScanTransferDto = {
      user: {
        ...userInfor,
        ...userInfor.userProfile,
      },
      amount,
      notes: 'Chuyển tiền',
    };

    const qrCodeImage = await QRCode.toDataURL(JSON.stringify(dataQr));

    return {
      qrCodeImage,
    };
  }
}
