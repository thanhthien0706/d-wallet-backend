import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SecondPasswordGuard extends AuthGuard('second-password') {}
