import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Payment } from '../mercado-pago/entities/payment.entity';
import { Order } from '../order/entities/order.entity';
import { Auth } from '../auth/entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Order, Auth])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
