import { Role } from '../rol.enum';

export interface UserPayload {
  id: string;
  email: string;
  isAdmin: boolean;
  roles: Role[];
}
