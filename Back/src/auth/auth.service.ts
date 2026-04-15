/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Auth } from './entities/auth.entity';
import { ChangePasswordDto, ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto, UpdateUserDto, VerifyCodeDto, ChangePasswordWithCodeDto, VerifyRegistrationDto, VerifyAdminLoginDto } from './dtos/auth.dto';
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

    if (userFound && userFound.isVerified) {
      throw new BadRequestException('Usuario registrado anteriormente');
    }

    if (user.password !== user.password2)
      throw new BadRequestException('Ambas constraseñas deben ser iguales');

    const hashPassword: string = await bcrypt.hash(user.password, 10);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15);

    if (userFound) {
      // Si el usuario existe pero no está verificado, actualizamos sus datos y generamos nuevo código
      await this.authRepository.update(userFound.id, {
        username: user.username,
        password: hashPassword,
        phone: user.phone,
        address: user.address,
        registrationCode: code,
        registrationExpires: expires,
      });
    } else {
      // Registro nuevo
      await this.authRepository.save({
        username: user.username,
        email: user.email,
        password: hashPassword,
        phone: user.phone,
        address: user.address,
        isVerified: false,
        registrationCode: code,
        registrationExpires: expires,
      });
    }

    try {
      await this.mailService.sendRegistrationCode(user.email, code);
    } catch (error) {
      // Lanzamos una excepción informativa pero el usuario ya queda guardado en la DB 
      // para que pueda re-intentar el registro y recibir un nuevo código.
      throw new InternalServerErrorException(
        'Te has registrado con éxito, pero hubo un problema al enviar el correo. Por favor, intenta "registrarte" nuevamente con el mismo correo para reenviar el código de verificación.'
      );
    }

    return { message: 'Por favor, verifica tu correo. Te hemos enviado un código.', email: user.email };
  }

  async verifyRegistration(data: VerifyRegistrationDto) {
    const user = await this.authRepository.findOne({
      where: {
        email: data.email,
        registrationCode: data.code,
        registrationExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      // Check if user exists but code is expired or invalid
      const existingUser = await this.authRepository.findOne({ where: { email: data.email } });
      if (existingUser && existingUser.isVerified) {
        throw new BadRequestException('El usuario ya ha sido verificado');
      }
      throw new BadRequestException('Código inválido o expirado');
    }

    await this.authRepository.update(user.id, {
      isVerified: true,
      registrationCode: null,
      registrationExpires: null,
    });

    return { message: 'Correo verificado exitosamente' };
  }

  async loginUser(credentials: LoginDto) {
    const userFound = await this.authRepository.findOne({
      where: { email: credentials.email },
    });
    if (!userFound)
      throw new BadRequestException('Usuario o contraseña invalido');
    if (userFound.blockedAt)
      throw new BadRequestException('Usuario bloqueado');

    const passwordCompare = await bcrypt.compare(
      credentials.password,
      userFound.password,
    );
    if (!passwordCompare)
      throw new BadRequestException('Usuario o contraseña invalido');

    if (!userFound.isVerified)
      throw new BadRequestException('Debes verificar tu correo electrónico para poder iniciar sesión');

    // Admin 2FA Logic
    if (userFound.isAdmin) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + 15);

      await this.authRepository.update(userFound.id, {
        resetPasswordCode: code,
        resetPasswordExpires: expires,
      });

      await this.mailService.sendAdminLoginCode(userFound.email, code);

      return { requires2FA: true, message: 'Se ha enviado un código de acceso a tu correo de administrador', email: userFound.email };
    }

    const payload = {
      id: userFound.id,
      email: userFound.email,
      isAdmin: userFound.isAdmin,
      tokenVersion: userFound.tokenVersion,
    };

    const token: string = this.jwtService.sign(payload);

    return token;
  }

  async getUserById(id: string) {
    const user = await this.authRepository.findOne({ where: { id } });

    if (!user) throw new BadRequestException('Usuario no encontrado');
    if (user.blockedAt) throw new BadRequestException('Usuario bloqueado');

    return {
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      zipCode: user.zipCode,
      state: user.state,
    };
  }

  async getShippingData(id: string) {
    const user = await this.authRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('Usuario no encontrado');
    if (user.blockedAt) throw new BadRequestException('Usuario bloqueado');

    return {
      address: user.address,
      city: user.city,
      zipCode: user.zipCode,
      state: user.state,
      phone: user.phone,
      username: user.username,
    };
  }

  async updateUser(id: string, data: UpdateUserDto) {
    const user = await this.authRepository.findOne({ where: { id } });

    if (!user) throw new BadRequestException('Usuario no encontrado');
    if (user.blockedAt) throw new BadRequestException('Usuario bloqueado');

    await this.authRepository.update(id, data);

    const updatedUser = await this.authRepository.findOne({ where: { id } });

    if (!updatedUser) throw new BadRequestException('Error al actualizar');

    return {
      username: updatedUser.username,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      city: updatedUser.city,
      zipCode: updatedUser.zipCode,
      state: updatedUser.state,
    };
  }

  async changePassword(id: string, data: ChangePasswordDto) {
    const user: Auth | null = await this.authRepository.findOne({
      where: { id: id },
    });

    if (!user) throw new BadRequestException('Usuario no encontrado');
    if (user.blockedAt) throw new BadRequestException('Usuario bloqueado');

    if (data.password !== data.password2)
      throw new BadRequestException('Ambas constraseñas deben ser iguales');

    const hashPassword: string = await bcrypt.hash(data.password, 10);

    await this.authRepository.update(id, { password: hashPassword });

    return 'Contraseña actualizada con éxito';
  }

  async requestPasswordChangeCode(id: string) {
    const user = await this.authRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (user.blockedAt) throw new BadRequestException('Usuario bloqueado');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15);

    await this.authRepository.update(user.id, {
      resetPasswordCode: code,
      resetPasswordExpires: expires,
    });

    await this.mailService.sendResetCode(user.email, code);

    return 'Código de confirmación enviado al correo';
  }

  async verifyAdminLogin(data: VerifyAdminLoginDto) {
    const user = await this.authRepository.findOne({
      where: {
        email: data.email,
        resetPasswordCode: data.code,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });

    if (!user || !user.isAdmin) throw new BadRequestException('Código inválido o expirado');
    if (user.blockedAt) throw new BadRequestException('Usuario bloqueado');

    // Clean up DB code
    await this.authRepository.update(user.id, {
      resetPasswordCode: null,
      resetPasswordExpires: null,
    });

    const payload = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      tokenVersion: user.tokenVersion,
    };

    const token: string = this.jwtService.sign(payload, { expiresIn: '1d' });
    return token;
  }

  async changePasswordWithCode(id: string, data: ChangePasswordWithCodeDto) {
    const user: Auth | null = await this.authRepository.findOne({
      where: {
        id: id,
        resetPasswordCode: data.code,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });

    if (!user) throw new BadRequestException('Código inválido o expirado');
    if (user.blockedAt) throw new BadRequestException('Usuario bloqueado');

    if (data.password !== data.password2)
      throw new BadRequestException('Ambas contraseñas deben ser iguales');

    const hashPassword: string = await bcrypt.hash(data.password, 10);

    await this.authRepository.update(id, { 
      password: hashPassword,
      resetPasswordCode: null,
      resetPasswordExpires: null,
      tokenVersion: user.tokenVersion + 1,
      isVerified: true,
    });

    return 'Contraseña actualizada con éxito';
  }

  async deleteUser(id: string) {
    const user: Auth | null = await this.authRepository.findOne({
      where: { id: id },
    });

    if (!user) throw new BadRequestException('Usuario no encontrado');
    if (user.blockedAt) throw new BadRequestException('Usuario bloqueado');

    await this.authRepository.delete(id);

    return 'Usuario eliminado con éxito';
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const user = await this.authRepository.findOne({
      where: { email: data.email },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (user.blockedAt) throw new BadRequestException('Usuario bloqueado');

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
    if (user.blockedAt) throw new BadRequestException('Usuario bloqueado');

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
    if (user.blockedAt) throw new BadRequestException('Usuario bloqueado');

    const hashPassword = await bcrypt.hash(data.password, 10);

    await this.authRepository.update(user.id, {
      password: hashPassword,
      resetPasswordCode: null,
      resetPasswordExpires: null,
      tokenVersion: user.tokenVersion + 1,
      isVerified: true,
    });

    return 'Contraseña restablecida con éxito';
  }

  async blockUser(id: string) {
    const user = await this.authRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    
    await this.authRepository.update(id, { blockedAt: new Date() });
    return 'Usuario bloqueado con éxito';
  }

  async unblockUser(id: string) {
    const user = await this.authRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    
    await this.authRepository.update(id, { blockedAt: null });
    return 'Usuario desbloqueado con éxito';
  }

  async getAllUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [users, total] = await this.authRepository.findAndCount({
      skip: skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      users: users.map((user) => {
        const { password, resetPasswordCode, resetPasswordExpires, ...result } = user;
        return result;
      }),
      total,
      page,
      limit,
    };
  }

  async searchUsersByName(name: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [users, total] = await this.authRepository.findAndCount({
      where: { username: ILike(`%${name}%`) },
      skip: skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      users: users.map((user) => {
        const { password, resetPasswordCode, resetPasswordExpires, ...result } = user;
        return result;
      }),
      total,
      page,
      limit,
    };
  }
}
