import { Controller } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('firebase')
@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}
}
