import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Query,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
  ApiConsumes,
  ApiParam,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/rol.decorator';
import { Role } from 'src/auth/rol.enum';
import { ProductType } from './clasification.enum';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El producto ya existe' })
  @ApiBody({ type: CreateProductDto })
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.create(createProductDto, file);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Obtener todas las categorías de productos' })
  @ApiResponse({ status: 200, description: 'Lista de categorías obtenida' })
  getCategories() {
    return this.productsService.getCategories();
  }

  @Get('types')
  @ApiOperation({ summary: 'Obtener todos los tipos de productos' })
  @ApiResponse({ status: 200, description: 'Lista de tipos obtenida' })
  getTypes() {
    return this.productsService.getTypes();
  }

  @Get('subtypes/:type')
  @ApiOperation({ summary: 'Obtener subtipos por tipo de producto' })
  @ApiParam({ name: 'type', enum: ProductType, description: 'Tipo de producto' })
  @ApiResponse({ status: 200, description: 'Lista de subtipos obtenida' })
  getSubtypes(@Param('type') type: ProductType) {
    return this.productsService.getSubtypes(type);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los productos con filtros opcionales y paginación',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos paginada obtenida exitosamente',
  })
  findAll(@Query() filters: FilterProductsDto) {
    return this.productsService.findAll(filters);
  }

  @Put(':id/image')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Subir o actualizar imagen de un producto' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Imagen subida exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.uploadImageProduct(file, id);
  }

  @Delete(':id/image')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Eliminar imagen de un producto' })
  @ApiQuery({
    name: 'imgUrl',
    required: true,
    description: 'URL de la imagen a eliminar',
  })
  @ApiResponse({ status: 200, description: 'Imagen eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  deleteImage(@Param('id') id: string, @Query('imgUrl') imgUrl: string) {
    return this.productsService.deleteImageProduct(id, imgUrl);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  remove(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
