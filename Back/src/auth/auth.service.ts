/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Auth } from './entities/auth.entity';
import { ChangePasswordDto, LoginDto, RegisterDto } from './dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(user: RegisterDto) {
    const userFound: Auth | null = await this.authRepository.findOne({
      where: { email: user.email },
    });
    if (userFound)
      throw new BadRequestException('Usuario registrado anteriormente');

    if (user.password !== user.password2)
      throw new BadRequestException('Ambas constraseñas deben ser iguales');

    const hashPassword: string = await bcrypt.hash(user.password, 10);

    const newUser: Auth = await this.authRepository.save({
      username: user.username,
      email: user.email,
      password: hashPassword,
      phone: user.phone,
    });

    return 'Usuario registrado con éxito';
  }

  async loginUser(credentials: LoginDto) {
    const userFound = await this.authRepository.findOne({
      where: { email: credentials.email },
    });
    if (!userFound)
      throw new BadRequestException('Usuario o contraseña invalido');

    const passwordCompare = await bcrypt.compare(
      credentials.password,
      userFound.password,
    );
    if (!passwordCompare)
      throw new BadRequestException('Usuario o contraseña invalido');

    const payload = {
      id: userFound.id,
      email: userFound.email,
      isAdmin: userFound.isAdmin,
    };

    const token: string = this.jwtService.sign(payload);

    return token;
  }

  async getUserById(id: string) {
    const user = await this.authRepository.findOne({ where: { id } });

    if (!user) throw new BadRequestException('Usuario no encontrado');

    return {
      username: user.username,
      email: user.email,
      phone: user.phone,
    };
  }

  async changePassword(id: string, data: ChangePasswordDto) {
    const user: Auth | null = await this.authRepository.findOne({
      where: { id: id },
    });

    if (!user) throw new BadRequestException('Usuario no encontrado');

    if (data.password !== data.password2)
      throw new BadRequestException('Ambas constraseñas deben ser iguales');

    const hashPassword: string = await bcrypt.hash(data.password, 10);

    await this.authRepository.update(id, { password: hashPassword });

    return 'Contraseña actualizada con éxito';
  }

  async deleteUser(id: string) {
    const user: Auth | null = await this.authRepository.findOne({
      where: { id: id },
    });

    if (!user) throw new BadRequestException('Usuario no encontrado');

    await this.authRepository.delete(id);

    return 'Usuario eliminado con éxito';
  }
}
