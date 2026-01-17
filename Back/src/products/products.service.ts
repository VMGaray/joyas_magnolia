import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { FileUploadService } from 'src/image-upload/image-upload.service';
import { BraceletsSubtypes, Category, ChainsSubtypes, EarringsSubtypes, PendantsSubtypes, ProductType, RingsSubtypes } from './clasification.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async create(createProductDto: CreateProductDto, file?: Express.Multer.File) {
    const { ...productData } = createProductDto;

    // Verificar si ya existe un producto con el mismo nombre, categoría y tipo
    const existingProduct = await this.productRepository.findOne({
      where: {
        name: productData.name,
        category: productData.category,
        productType: productData.productType,
      },
    });

    if (existingProduct) {
      throw new ConflictException(
        `Ya existe un producto con el nombre "${productData.name}" en la categoría "${productData.category}" y tipo "${productData.productType}"`,
      );
    }

    // Subir imagen si se proporciona un archivo
    let imageUrl: string | null = null;
    if (file) {
      imageUrl = await this.fileUploadService.uploadImage(file, 'products');
    }

    // Crear el producto
    const product = this.productRepository.create({
      ...productData,
      imageUrl,
    });

    return this.productRepository.save(product);
  }

  async findAll(filters: FilterProductsDto) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const skip = (page - 1) * limit;

    const qb = this.productRepository.createQueryBuilder('product');

    if (filters.category) {
      qb.andWhere('product.category = :category', {
        category: filters.category,
      });
    }
    if (filters.type) {
      qb.andWhere('product.productType = :type', { type: filters.type });
    }
    // Para los subtipos, como están en columnas separadas, habría que filtrar por la columna correspondiente
    // o simplemente donde alguno de los subtipos coincida si el filtro es genérico.
    // Asumiremos que el filtro de subtipo busca en todas las columnas de subtipo.
    if (filters.subtype) {
      qb.andWhere(
        '(product.rings_subtype = :subtype OR product.earrings_subtype = :subtype OR product.chains_subtype = :subtype OR product.bracelets_subtype = :subtype OR product.pendants_subtype = :subtype)',
        { subtype: filters.subtype },
      );
    }

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async uploadImageProduct(
    file: Express.Multer.File,
    idProduct: string,
    folder?: string,
  ) {
    const productFound: Product | null = await this.productRepository.findOne({
      where: { id: idProduct },
    });

    if (!productFound) {
      throw new NotFoundException(`Producto con ID ${idProduct} no encontrado`);
    }
    const imgUrl = await this.fileUploadService.uploadImage(file, folder);

    productFound.imageUrl = imgUrl;
    return await this.productRepository.save(productFound);
  }

  async deleteImageProduct(idProduct: string, imgUrl: string) {
    const productFound: Product | null = await this.productRepository.findOne({
      where: { id: idProduct },
    });
    if (!productFound) {
      throw new NotFoundException(`Producto con ID ${idProduct} no encontrado`);
    }

    await this.fileUploadService.deleteImageByUrl(imgUrl);

    productFound.imageUrl = null;
    return await this.productRepository.save(productFound);
  }

  async deleteProduct(idProduct: string) {
    const productFound: Product | null = await this.productRepository.findOne({
      where: { id: idProduct },
    });
    if (!productFound) {
      throw new NotFoundException(`Producto con ID ${idProduct} no encontrado`);
    }

    const imageUrl = productFound.imageUrl;
    if (imageUrl) {
      await this.fileUploadService.deleteImageByUrl(imageUrl);
    }

    return await this.productRepository.remove(productFound);
  }

  getCategories() {
    return Object.values(Category);
  }

  getTypes() {
    return Object.values(ProductType);
  }

  getSubtypes(type: ProductType) {
    switch (type) {
      case ProductType.Rings:
        return Object.values(RingsSubtypes);
      case ProductType.Earrings:
        return Object.values(EarringsSubtypes);
      case ProductType.Chains:
        return Object.values(ChainsSubtypes);
      case ProductType.Bracelets:
        return Object.values(BraceletsSubtypes);
      case ProductType.Pendants:
        return Object.values(PendantsSubtypes);
      default:
        return [];
    }
  }
}
