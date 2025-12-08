/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { ProductType } from './entities/product-type.entity';
import { Subtype } from './entities/subtype.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, ProductType, Subtype]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule implements OnModuleInit {
  constructor(private readonly productsService: ProductsService) {}

  async onModuleInit() {
    try {
      console.log(
        '🌱 Iniciando seed automático de categorías y tipos de productos...',
      );
      await this.productsService.seed();
      console.log('✅ Seed de categorías y tipos completado exitosamente');
    } catch (error) {
      console.error('❌ Error al ejecutar seed automático:', error.message);
    }
  }
}
