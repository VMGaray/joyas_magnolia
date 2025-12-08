import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/auth/rol.enum';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
