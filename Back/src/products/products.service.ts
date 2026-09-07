import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { FileUploadService } from 'src/image-upload/image-upload.service';
import { BraceletsSubtypes, Category, ChainsSubtypes, EarringsSubtypes, PendantsSubtypes, ProductType, RingsSubtypes } from './clasification.enum';

// Máximo de fotos por producto.
export const MAX_PRODUCT_IMAGES = 8;

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly fileUploadService: FileUploadService,
  ) { }

  // Deja imageUrl (portada) siempre igual a la primera foto de la galería.
  // Guardamos null (no []) cuando no hay fotos: 'simple-array' de TypeORM
  // devuelve [''] al releer una cadena vacía.
  private syncCover(product: Product): void {
    const images = (product.images ?? []).filter((u) => typeof u === 'string' && u.trim() !== '');
    product.images = images.length > 0 ? images : (null as unknown as string[]);
    product.imageUrl = images.length > 0 ? images[0] : null;
  }

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

    // Subir imagen si se proporciona un archivo (carga en un solo paso).
    const images: string[] = [];
    if (file) {
      images.push(await this.fileUploadService.uploadImage(file, 'products'));
    }

    // Crear el producto
    const product = this.productRepository.create({
      ...productData,
      images: images.length > 0 ? images : (null as unknown as string[]),
      imageUrl: images[0] ?? null,
    });

    return this.productRepository.save(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async findAll(filters: FilterProductsDto) {
    const page = filters.page ?? 1;
    // Sin límite explícito no recortamos el catálogo: se devuelven todos los productos.
    const limit = filters.limit;

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

    if (filters.tags && filters.tags.length > 0) {
      qb.andWhere(
        new Brackets((innerQb) => {
          filters.tags?.forEach((tag, index) => {
            const paramName = `tag${index}`;
            innerQb.orWhere(`product.tags LIKE :${paramName}`, {
              [paramName]: `%${tag}%`,
            });
          });
        }),
      );
    }

    // Las joyas más nuevas siempre arriba.
    qb.orderBy('product.createdAt', 'DESC');

    if (limit) {
      qb.skip((page - 1) * limit).take(limit);
    }

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit: limit ?? total,
      totalPages: limit ? Math.ceil(total / limit) : 1,
    };
  }

  // Agrega una o varias fotos a la galería del producto.
  async addImagesToProduct(
    files: Express.Multer.File[],
    idProduct: string,
    folder = 'products',
  ) {
    const productFound: Product | null = await this.productRepository.findOne({
      where: { id: idProduct },
    });

    if (!productFound) {
      throw new NotFoundException(`Producto con ID ${idProduct} no encontrado`);
    }

    if (!files || files.length === 0) {
      throw new BadRequestException('No se recibió ninguna imagen');
    }

    const current = productFound.images ?? [];
    if (current.length + files.length > MAX_PRODUCT_IMAGES) {
      throw new BadRequestException(
        `El producto no puede tener más de ${MAX_PRODUCT_IMAGES} fotos (tiene ${current.length})`,
      );
    }

    const uploaded: string[] = [];
    for (const file of files) {
      uploaded.push(await this.fileUploadService.uploadImage(file, folder));
    }

    productFound.images = [...current, ...uploaded];
    this.syncCover(productFound);
    return await this.productRepository.save(productFound);
  }

  // Compat: subir/actualizar una sola imagen = agregarla a la galería.
  async uploadImageProduct(
    file: Express.Multer.File,
    idProduct: string,
    folder = 'products',
  ) {
    return this.addImagesToProduct([file], idProduct, folder);
  }

  async deleteImageProduct(idProduct: string, imgUrl: string) {
    const productFound: Product | null = await this.productRepository.findOne({
      where: { id: idProduct },
    });
    if (!productFound) {
      throw new NotFoundException(`Producto con ID ${idProduct} no encontrado`);
    }

    await this.fileUploadService.deleteImageByUrl(imgUrl);

    productFound.images = (productFound.images ?? []).filter((u) => u !== imgUrl);
    this.syncCover(productFound);
    return await this.productRepository.save(productFound);
  }

  // Reordena la galería para que 'imgUrl' quede como portada.
  async setCoverImage(idProduct: string, imgUrl: string) {
    const productFound: Product | null = await this.productRepository.findOne({
      where: { id: idProduct },
    });
    if (!productFound) {
      throw new NotFoundException(`Producto con ID ${idProduct} no encontrado`);
    }

    const images = productFound.images ?? [];
    if (!images.includes(imgUrl)) {
      throw new BadRequestException('Esa foto no pertenece al producto');
    }

    productFound.images = [imgUrl, ...images.filter((u) => u !== imgUrl)];
    this.syncCover(productFound);
    return await this.productRepository.save(productFound);
  }

  async deleteProduct(idProduct: string) {
    const productFound: Product | null = await this.productRepository.findOne({
      where: { id: idProduct },
    });
    if (!productFound) {
      throw new NotFoundException(`Producto con ID ${idProduct} no encontrado`);
    }

    // Borra todas las fotos del producto de Cloudinary (galería + portada legacy).
    const urlsToDelete = new Set<string>([
      ...(productFound.images ?? []),
      ...(productFound.imageUrl ? [productFound.imageUrl] : []),
    ]);
    for (const url of urlsToDelete) {
      try {
        await this.fileUploadService.deleteImageByUrl(url);
      } catch {
        // Si una imagen ya no está en Cloudinary, igual seguimos borrando el producto.
      }
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

  async findByTag(tagsString: string) {
    const tags = tagsString.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0);

    if (tags.length === 0) return [];

    return this.productRepository
      .createQueryBuilder('product')
      .where(
        new Brackets((innerQb) => {
          tags.forEach((tag, index) => {
            const paramName = `tag${index}`;
            innerQb.orWhere(`product.tags LIKE :${paramName}`, {
              [paramName]: `%${tag}%`,
            });
          });
        }),
      )
      .getMany();
  }

  async removeTag(idProduct: string, tagToRemove: string) {
    const product = await this.findOne(idProduct);

    if (product.tags) {
      product.tags = product.tags.filter((t) => t !== tagToRemove);
      return this.productRepository.save(product);
    }

    return product;
  }

  async getAllTags() {
    const products = await this.productRepository.find({
      select: ['tags'],
    });

    const allTags = new Set<string>();
    products.forEach((p) => {
      if (p.tags) {
        p.tags.forEach((tag) => allTags.add(tag));
      }
    });

    return Array.from(allTags);
  }
}
