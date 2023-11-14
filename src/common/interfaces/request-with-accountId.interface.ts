import { Request } from 'express';

export interface RequestWithAccountId extends Request {
  id: number;
}
