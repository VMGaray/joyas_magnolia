/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Auth } from './entities/auth.entity';
import { ChangePasswordDto, ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto, UpdateUserDto, VerifyCodeDto } from './dtos/auth.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) { }

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
      address: user.address,
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
      address: user.address,
    };
  }

  async updateUser(id: string, data: UpdateUserDto) {
    const user = await this.authRepository.findOne({ where: { id } });

    if (!user) throw new BadRequestException('Usuario no encontrado');

    await this.authRepository.update(id, data);

    const updatedUser = await this.authRepository.findOne({ where: { id } });

    if (!updatedUser) throw new BadRequestException('Error al actualizar');

    return {
      username: updatedUser.username,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address
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

  async forgotPassword(data: ForgotPasswordDto) {
    const user = await this.authRepository.findOne({
      where: { email: data.email },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15);

    await this.authRepository.update(user.id, {
      resetPasswordCode: code,
      resetPasswordExpires: expires,
    });

    await this.mailService.sendResetCode(user.email, code);

    return 'Código de recuperación enviado al correo';
  }

  async verifyResetCode(data: VerifyCodeDto) {
    const user = await this.authRepository.findOne({
      where: {
        email: data.email,
        resetPasswordCode: data.code,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });

    if (!user) throw new BadRequestException('Código inválido o expirado');

    return { message: 'Código verificado con éxito', valid: true };
  }

  async resetPassword(data: ResetPasswordDto) {
    if (data.password !== data.password2)
      throw new BadRequestException('Ambas contraseñas deben ser iguales');

    const user = await this.authRepository.findOne({
      where: {
        email: data.email,
        resetPasswordCode: data.code,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });

    if (!user) throw new BadRequestException('Código inválido o expirado');

    const hashPassword = await bcrypt.hash(data.password, 10);

    await this.authRepository.update(user.id, {
      password: hashPassword,
      resetPasswordCode: undefined,
      resetPasswordExpires: undefined,
    });

    return 'Contraseña restablecida con éxito';
  }
}
