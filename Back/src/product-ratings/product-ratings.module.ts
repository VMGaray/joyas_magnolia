import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRatingsService } from './product-ratings.service';
import { ProductRatingsController } from './product-ratings.controller';
import { ProductRating } from './entities/product-rating.entity';
import { Product } from 'src/products/entities/product.entity';
import { Auth } from 'src/auth/entities/auth.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductRating, Product, Auth]),
  ],
  controllers: [ProductRatingsController],
  providers: [ProductRatingsService],
  exports: [ProductRatingsService],
})
export class ProductRatingsModule {}
