import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/rol.decorator';
import { Role } from 'src/auth/rol.enum';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  @ApiResponse({
    status: 404,
    description: 'Categoría, tipo o subtipo no encontrado',
  })
  @ApiResponse({ status: 409, description: 'El producto ya existe' })
  @ApiBody({ type: CreateProductDto })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los productos con filtros opcionales y paginación',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos paginada obtenida exitosamente',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filtrar por categoría',
    example: 'Plata 925',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filtrar por tipo de producto',
    example: 'Anillos',
  })
  @ApiQuery({
    name: 'subtype',
    required: false,
    description: 'Filtrar por subtipo',
    example: 'Piedras naturales',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página (por defecto: 1)',
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Cantidad de productos por página (por defecto: 10)',
    example: 10,
    type: Number,
  })
  findAll(@Query() filters: FilterProductsDto) {
    return this.productsService.findAll(filters);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías obtenida exitosamente',
  })
  getCategories() {
    return this.productsService.getCategories();
  }

  @Get('product-types')
  @ApiOperation({
    summary: 'Obtener todos los tipos de productos con sus categorías',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de productos obtenida exitosamente',
  })
  getProductTypes() {
    return this.productsService.getProductTypes();
  }

  @Get('subtypes')
  @ApiOperation({ summary: 'Obtener todos los subtipos con sus relaciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de subtipos obtenida exitosamente',
  })
  getSubtypes() {
    return this.productsService.getSubtypes();
  }

  @Post('seed')
  @ApiOperation({
    summary:
      'Poblar la base de datos con clasificaciones (categorías, tipos, subtipos)',
  })
  @ApiResponse({
    status: 201,
    description: 'Clasificaciones creadas exitosamente',
  })
  seed() {
    return this.productsService.seed();
  }

  @Post('seed-products')
  @ApiOperation({
    summary: 'Poblar la base de datos con 10 productos de ejemplo',
  })
  @ApiResponse({
    status: 201,
    description: 'Productos de ejemplo creados exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Debes ejecutar el seed principal primero',
  })
  seedProducts() {
    return this.productsService.seedProducts();
  }
}
