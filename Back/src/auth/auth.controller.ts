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
import { ChangePasswordDto, LoginDto, RegisterDto, UpdateUserDto } from './dtos/auth.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/rol.decorator';
import { Role } from './rol.enum';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: 'Register a new user' })
  @Post('register')
  async register(@Body() user: RegisterDto) {
    return this.authService.registerUser(user);
  }

  @ApiOperation({ summary: 'Login a user' })
  @Post('login')
  async login(@Body() credentials: LoginDto) {
    return this.authService.loginUser(credentials);
  }

  @ApiOperation({ summary: 'Get user profile' })
  @Get('profile/:id')
  @ApiBearerAuth()
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  async getProfile(@Param('id') id: string) {
    return this.authService.getUserById(id);
  }

  @ApiOperation({ summary: 'Update user profile' })
  @Put('profile/:id')
  @ApiBearerAuth()
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  async updateProfile(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ) {
    return this.authService.updateUser(id, data);
  }

  @ApiOperation({ summary: 'Change user password' })
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

  @ApiOperation({ summary: 'Delete user account' })
  @Delete('delete-account/:id')
  async deleteAccount(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }
}
