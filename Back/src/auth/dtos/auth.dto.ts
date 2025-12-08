import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

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
