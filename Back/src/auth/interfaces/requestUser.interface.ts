import { Request } from 'express';
import { UserPayload } from './userPayload.interface';

export interface RequestWithUser extends Request {
  user: UserPayload;
}
