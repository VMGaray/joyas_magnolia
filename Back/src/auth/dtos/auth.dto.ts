import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Maria Perez',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 80)
  username?: string;

  @ApiProperty({
    example: '1234567890',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  phone?: number;

  @ApiProperty({
    example: 'Calle Falsa 123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 150)
  address?: string;
}

export class RegisterDto {
  @ApiProperty({
    example: 'Maria Perez',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 80)
  username: string;

  @ApiProperty({
    example: 'mariaperez@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Contraseña1234+',
  })
  @IsNotEmpty()
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @Length(3, 15)
  password: string;

  @ApiProperty({
    example: 'Contraseña1234+',
  })
  @IsNotEmpty()
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @Length(3, 15)
  password2: string;

  @ApiProperty({
    example: '1234567890',
  })
  @IsNotEmpty()
  @IsNumber()
  phone: number;

  @ApiProperty({
    example: 'Calle Falsa 123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 150)
  address?: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'mariaperez@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Contraseña1234+',
  })
  @IsNotEmpty()
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @Length(3, 15)
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    example: 'Contraseña1234+',
  })
  @IsNotEmpty()
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @Length(3, 15)
  password: string;

  @ApiProperty({
    example: 'Contraseña1234+',
  })
  @IsNotEmpty()
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @Length(3, 15)
  password2: string;
}

export class ChangePasswordWithCodeDto {
  @ApiProperty({
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  code: string;

  @ApiProperty({
    example: 'Contraseña1234+',
  })
  @IsNotEmpty()
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @Length(3, 15)
  password: string;

  @ApiProperty({
    example: 'Contraseña1234+',
  })
  @IsNotEmpty()
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @Length(3, 15)
  password2: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'mariaperez@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class VerifyCodeDto {
  @ApiProperty({
    example: 'mariaperez@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  code: string;
}

export class VerifyRegistrationDto {
  @ApiProperty({
    example: 'mariaperez@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  code: string;
}

export class VerifyAdminLoginDto {
  @ApiProperty({
    example: 'admin@magnolia.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  code: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    example: 'mariaperez@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  code: string;

  @ApiProperty({
    example: 'NuevaContraseña1234+',
  })
  @IsNotEmpty()
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @Length(3, 15)
  password: string;

  @ApiProperty({
    example: 'NuevaContraseña1234+',
  })
  @IsNotEmpty()
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @Length(3, 15)
  password2: string;
}
