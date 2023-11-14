import { User } from '@decorators/user.decorator';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryScanToTransferDto } from './dto/query-scan-transfer.dto';
import { UserInforValidate } from '@/users/dto/user-infor-validate.dto';
import { Auth } from '@decorators/auth.decorator';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { QrCodeService } from './qr-code.service';
import { ReturnRenderQrcodeDto } from './dto/return-render-qrcode.dto';
import { Serialize } from '@decorators/Serialize.decorator';

@ApiBearerAuth()
@ApiTags('qr-code')
@Controller('qr-code')
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  @Get()
  @Auth()
  @ApiOkResponse({
    description: 'Render a QR Code of transfer',
    type: ReturnRenderQrcodeDto,
  })
  @Serialize(ReturnRenderQrcodeDto)
  scanToTransfer(
    @Query() { amount }: QueryScanToTransferDto,
    @User() account: UserInforValidate,
  ) {
    return this.qrCodeService.handleScanToTransfer(account, amount);
  }
}
