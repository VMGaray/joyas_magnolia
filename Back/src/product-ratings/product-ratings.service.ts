import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
import { ProductRating } from './entities/product-rating.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class ProductRatingsService {
  constructor(
    @InjectRepository(ProductRating)
    private readonly ratingRepository: Repository<ProductRating>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async rateProduct(
    productId: string,
    userId: string,
    rating: number,
    comment?: string,
  ): Promise<ProductRating> {
    if (rating < 1 || rating > 5) {
      throw new Error('La puntuación debe estar entre 1 y 5');
    }

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }

    let existingRating = await this.ratingRepository.findOne({
      where: { product: { id: productId }, user: { id: userId } },
    });

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.comment = comment ?? null;
      await this.ratingRepository.save(existingRating);
    } else {
      existingRating = this.ratingRepository.create({
        rating,
        comment: comment ?? null,
        product: { id: productId },
        user: { id: userId },
      });
      await this.ratingRepository.save(existingRating);
    }

    await this.updateProductAverageRating(productId);

    return existingRating;
  }

  async updateProductAverageRating(productId: string): Promise<void> {
    const result = await this.ratingRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.rating)', 'average')
      .addSelect('COUNT(rating.id)', 'count')
      .where('rating.productId = :productId', { productId })
      .getRawOne();

    const averageRating = parseFloat(result.average) || 0;
    const ratingCount = parseInt(result.count) || 0;

    await this.productRepository.update(productId, {
      averageRating,
      ratingCount,
    });
  }

  async getFeaturedProducts(
    minRating: number = 4.0,
    minReviews: number = 10,
    limit: number = 10,
  ): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.averageRating >= :minRating', { minRating })
      .andWhere('product.ratingCount >= :minReviews', { minReviews })
      .andWhere('product.stock > 0')
      .orderBy('product.averageRating', 'DESC')
      .addOrderBy('product.ratingCount', 'DESC')
      .limit(limit)
      .getMany();
  }

  async getProductsByRatingRange(
    min: number,
    max: number,
    minReviews: number = 1,
  ): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        averageRating: Between(min, max),
        ratingCount: MoreThan(minReviews - 1),
        stock: MoreThan(0),
      },
      order: {
        averageRating: 'DESC',
      },
    });
  }

  async getTopRatedProducts(limit: number = 10): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.ratingCount > 0')
      .andWhere('product.stock > 0')
      .orderBy('product.averageRating', 'DESC')
      .addOrderBy('product.ratingCount', 'DESC')
      .limit(limit)
      .getMany();
  }

  async manuallyFeatureProduct(
    productId: string,
    isFeatured: boolean,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }

    product.isFeatured = isFeatured;
    return this.productRepository.save(product);
  }

  async getProductRatings(productId: string): Promise<ProductRating[]> {
    return this.ratingRepository.find({
      where: { product: { id: productId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAverageRating(productId: string): Promise<{
    average: number;
    count: number;
    distribution: Record<number, number>;
  }> {
    const ratings = await this.ratingRepository.find({
      where: { product: { id: productId } },
    });

    if (ratings.length === 0) {
      return {
        average: 0,
        count: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const average = total / ratings.length;

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach((rating) => {
      distribution[rating.rating]++;
    });

    Object.keys(distribution).forEach((key) => {
      distribution[key] = (distribution[key] / ratings.length) * 100;
    });

    return {
      average,
      count: ratings.length,
      distribution,
    };
  }
}
