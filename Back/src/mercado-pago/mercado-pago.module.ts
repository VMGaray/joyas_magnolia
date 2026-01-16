import { Module } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';
import { MercadoPagoController } from './mercado-pago.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Product } from '../products/entities/product.entity';
import { Auth } from '../auth/entities/auth.entity';
import { Order } from '../order/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Product, Auth, Order])],
  controllers: [MercadoPagoController],
  providers: [MercadoPagoService],
})
export class MercadoPagoModule {}
