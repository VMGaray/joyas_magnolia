/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from './config/typeorm';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UploadImageModule } from './image-upload/image-upload.module';
import { MercadoPagoModule } from './mercado-pago/mercado-pago.module';
import { ProductRatingsModule } from './product-ratings/product-ratings.module';
import { AdminModule } from './admin/admin.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Tomamos la config ya definida en tu typeOrmConfig
        const cfg = configService.get('typeorm') as Record<string, any>;
        // Aseguramos opciones seguras por defecto
        return {
          autoLoadEntities: true,
          retryAttempts: cfg?.retryAttempts ?? 5,
          retryDelay: cfg?.retryDelay ?? 2000,
          ...cfg,
        };
      },
    }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '60m' },
      secret: process.env.JWT_SECRET,
    }),
    ProductsModule,
    AuthModule,
    UploadImageModule,
    MercadoPagoModule,
    ProductRatingsModule,
    AdminModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
