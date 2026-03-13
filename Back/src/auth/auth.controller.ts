import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto, ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto, UpdateUserDto, VerifyCodeDto } from './dtos/auth.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
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

  @ApiBearerAuth()
  @Roles(Role.User)
  @ApiOperation({ summary: 'Delete user account' })
  @Delete('delete-account/:id')
  async deleteAccount(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }

  @ApiBearerAuth()
  @Roles(Role.User)
  @ApiOperation({ summary: 'Request password reset' })
  @Post('forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    return this.authService.forgotPassword(data);
  }

  @ApiBearerAuth()
  @Roles(Role.User)
  @ApiOperation({ summary: 'Verify reset code' })
  @Post('verify-code')
  async verifyCode(@Body() data: VerifyCodeDto) {
    return this.authService.verifyResetCode(data);
  }

  @ApiBearerAuth()
  @Roles(Role.User)
  @ApiOperation({ summary: 'Reset password' })
  @Post('reset-password')
  async resetPassword(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data);
  }

  @Get('users')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all users paginated (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getAllUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.authService.getAllUsers(Number(page), Number(limit));
  }

  @Get('users/search')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Search users by name paginated (Admin only)' })
  @ApiQuery({ name: 'name', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async searchUsers(
    @Query('name') name: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.authService.searchUsersByName(name, Number(page), Number(limit));
  }

  @Put('block/:id')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Block a user account (Admin only)' })
  async blockUser(@Param('id') id: string) {
    return this.authService.blockUser(id);
  }

  @Put('unblock/:id')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Unblock a user account (Admin only)' })
  async unblockUser(@Param('id') id: string) {
    return this.authService.unblockUser(id);
  }
}
