import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto, LoginDto, RegisterDto } from './dtos/auth.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/decorators/rol.decorator';
import { Role } from './rol.enum';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() user: RegisterDto) {
    return this.authService.registerUser(user);
  }

  @Post('login')
  async login(@Body() credentials: LoginDto) {
    return this.authService.loginUser(credentials);
  }

  @Get('profile/:id')
    @ApiBearerAuth()
    @Roles(Role.User)
    @UseGuards(AuthGuard, RolesGuard)
  async getProfile(@Param('id') id: string) {
    return this.authService.getUserById(id);
  }

  @Put('change-password/:id')
    @ApiBearerAuth()
    @Roles(Role.User)
    @UseGuards(AuthGuard, RolesGuard)
  async changePassword(
    @Param('id') id: string,
    @Body() data: ChangePasswordDto,
  ) {
    return this.authService.changePassword(id, data);
  }

  @Delete('delete-account/:id')
  async deleteAccount(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }
}
