import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductRatingsService } from './product-ratings.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RequestWithUser } from 'src/auth/interfaces/requestUser.interface';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Roles } from 'src/decorators/rol.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/rol.enum';

@ApiTags('product-ratings')
@Controller('product-ratings')
export class ProductRatingsController {
  constructor(private readonly ratingsService: ProductRatingsService) {}

  @Post(':productId/rate')
  @Roles(Role.User)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Calificar un producto' })
  @ApiResponse({ status: 201, description: 'Calificación guardada exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async rateProduct(
    @Param('productId') productId: string,
    @Body() createRatingDto: CreateRatingDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.ratingsService.rateProduct(
      productId,
      userId,
      createRatingDto.rating,
      createRatingDto.comment,
    );
  }

  @Get('featured')
  @ApiOperation({ summary: 'Obtener productos destacados' })
  async getFeaturedProducts(
    @Query('minRating') minRating?: number,
    @Query('minReviews') minReviews?: number,
    @Query('limit') limit?: number,
  ) {
    return this.ratingsService.getFeaturedProducts(
      minRating ? Number(minRating) : 4.0,
      minReviews ? Number(minReviews) : 10,
      limit ? Number(limit) : 10,
    );
  }

  @Get('top-rated')
  @ApiOperation({ summary: 'Obtener productos mejor valorados' })
  async getTopRatedProducts(@Query('limit') limit?: number) {
    return this.ratingsService.getTopRatedProducts(limit ? Number(limit) : 10);
  }

  @Get(':productId/ratings')
  @ApiOperation({ summary: 'Obtener todas las puntuaciones de un producto' })
  async getProductRatings(@Param('productId') productId: string) {
    return this.ratingsService.getProductRatings(productId);
  }

  @Get(':productId/stats')
  @ApiOperation({ summary: 'Obtener estadísticas de puntuación de un producto' })
  async getProductRatingStats(@Param('productId') productId: string) {
    return this.ratingsService.getAverageRating(productId);
  }
}
