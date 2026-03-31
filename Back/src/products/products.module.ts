/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { UploadImageModule } from 'src/image-upload/image-upload.module';
import { Auth } from '../auth/entities/auth.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Auth]),
    UploadImageModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
