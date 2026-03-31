/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { RequestWithUser } from '../interfaces/requestUser.interface';
import { UserPayload } from '../interfaces/userPayload.interface';
import { Role } from '../rol.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../entities/auth.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    const autentification = request.headers.authorization; //Bearer token
    if (!autentification) return false;

    const token = autentification.split(' ')[1];
    if (!token) return false;

    const secret = process.env.JWT_SECRET;

    try {
      const user: any = this.jwtService.verify(token, { secret });

      // Verificar versión del token en BD
      const dbUser = await this.authRepository.findOne({ where: { id: user.id } });
      if (!dbUser || dbUser.tokenVersion !== user.tokenVersion) {
        return false;
      }

      if (user.isAdmin) {
        user.roles = [Role.Admin];
      } else user.roles = [Role.User];

      request.user = user;

      return true;
    } catch (error) {
      return false;
    }
  }
}
