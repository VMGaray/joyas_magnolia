import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { AuthGuard } from './guards/auth.guard';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Auth]), MailModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
})
export class AuthModule { }
