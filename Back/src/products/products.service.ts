import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { ProductType } from './entities/product-type.entity';
import { Subtype } from './entities/subtype.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(ProductType)
    private productTypeRepository: Repository<ProductType>,
    @InjectRepository(Subtype)
    private subtypeRepository: Repository<Subtype>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { categoryId, productTypeId, subtypeId, ...productData } =
      createProductDto;

    // Buscar las entidades relacionadas
    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });
    if (!category) {
      throw new NotFoundException(
        `Categoría con ID ${categoryId} no encontrada`,
      );
    }

    const productType = await this.productTypeRepository.findOneBy({
      id: productTypeId,
    });
    if (!productType) {
      throw new NotFoundException(
        `Tipo de producto con ID ${productTypeId} no encontrado`,
      );
    }

    let subtype: Subtype | null = null;
    if (subtypeId) {
      const foundSubtype = await this.subtypeRepository.findOneBy({
        id: subtypeId,
      });
      if (!foundSubtype) {
        throw new NotFoundException(
          `Subtipo con ID ${subtypeId} no encontrado`,
        );
      }
      subtype = foundSubtype;
    }

    // Verificar si ya existe un producto con el mismo nombre, categoría y tipo
    const existingProduct = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.productType', 'productType')
      .where('product.name = :name', { name: productData.name })
      .andWhere('category.id = :categoryId', { categoryId })
      .andWhere('productType.id = :productTypeId', { productTypeId })
      .getOne();

    if (existingProduct) {
      throw new ConflictException(
        `Ya existe un producto con el nombre "${productData.name}" en la categoría "${category.name}" y tipo "${productType.name}"`,
      );
    }

    // Crear el producto
    const product = this.productRepository.create(productData);
    product.category = category;
    product.productType = productType;
    if (subtype) {
      product.subtype = subtype;
    }

    return this.productRepository.save(product);
  }

  async findAll(filters: FilterProductsDto) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const skip = (page - 1) * limit;

    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.productType', 'productType')
      .leftJoinAndSelect('product.subtype', 'subtype');

    if (filters.category) {
      qb.andWhere('category.name = :category', { category: filters.category });
    }
    if (filters.type) {
      qb.andWhere('productType.name = :type', { type: filters.type });
    }
    if (filters.subtype) {
      qb.andWhere('subtype.name = :subtype', { subtype: filters.subtype });
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

  async seed() {
    // Categories - mantener como está
    const categoriesData = [
      'Plata 925',
      'Oro 18 k',
      'Enchapados',
      'Personalizados',
      'Insumos',
    ];
    for (const name of categoriesData) {
      let category = await this.categoryRepository.findOneBy({ name });
      if (!category) {
        category = this.categoryRepository.create({ name });
        await this.categoryRepository.save(category);
      }
    }

    // Obtener categorías
    const plata925 = await this.categoryRepository.findOneBy({
      name: 'Plata 925',
    });
    const oro18k = await this.categoryRepository.findOneBy({
      name: 'Oro 18 k',
    });
    const enchapados = await this.categoryRepository.findOneBy({
      name: 'Enchapados',
    });

    // Product Types para las 3 categorías principales
    const productTypesData = [
      'Anillos',
      'Aros',
      'Cadenas',
      'Dijes',
      'Pulseras',
      'Conjuntos',
      'Combos',
    ];

    for (const category of [plata925, oro18k, enchapados]) {
      if (category) {
        for (const typeName of productTypesData) {
          let type = await this.productTypeRepository.findOneBy({
            name: typeName,
            category,
          });
          if (!type) {
            type = this.productTypeRepository.create({
              name: typeName,
              category,
            });
            await this.productTypeRepository.save(type);
          }
        }
      }
    }

    // Subtypes para Anillos
    const anillosSubtypes = [
      'Piedras naturales',
      'Cubic y micropave',
      'Cristal SW',
      'Plata lisa',
      'Elastizados',
      'Niolis',
      'Inflados',
      'Nacar y perlas',
      'Plata y oro',
    ];

    for (const category of [plata925, oro18k, enchapados]) {
      if (category) {
        const anillosType = await this.productTypeRepository.findOneBy({
          name: 'Anillos',
          category,
        });
        if (anillosType) {
          for (const subtypeName of anillosSubtypes) {
            let subtype = await this.subtypeRepository.findOneBy({
              name: subtypeName,
              productType: anillosType,
            });
            if (!subtype) {
              subtype = this.subtypeRepository.create({
                name: subtypeName,
                productType: anillosType,
              });
              await this.subtypeRepository.save(subtype);
            }
          }
        }
      }
    }

    // Subtypes para Aros
    const arosSubtypes = [
      'Argollas',
      'Colgantes',
      'Pasantes',
      'Abridores',
      'Inflados',
      'Con dijes',
      'Cuff',
      'Trepadores',
      'Plata y oro',
      'Otros',
    ];

    for (const category of [plata925, oro18k, enchapados]) {
      if (category) {
        const arosType = await this.productTypeRepository.findOneBy({
          name: 'Aros',
          category,
        });
        if (arosType) {
          for (const subtypeName of arosSubtypes) {
            let subtype = await this.subtypeRepository.findOneBy({
              name: subtypeName,
              productType: arosType,
            });
            if (!subtype) {
              subtype = this.subtypeRepository.create({
                name: subtypeName,
                productType: arosType,
              });
              await this.subtypeRepository.save(subtype);
            }
          }
        }
      }
    }

    // Subtypes para Cadenas
    const cadenasSubtypes = [
      'Denarios y rosarios',
      'Exclusivas e importante',
      'Finas y clasicas',
      'Nacar y perlas',
      'Piedras',
      'Trenzas',
      'Cristales',
      'Gamuza',
      'Con dijes',
      'Otras',
      'Hombres',
    ];

    for (const category of [plata925, oro18k, enchapados]) {
      if (category) {
        const cadenasType = await this.productTypeRepository.findOneBy({
          name: 'Cadenas',
          category,
        });
        if (cadenasType) {
          for (const subtypeName of cadenasSubtypes) {
            let subtype = await this.subtypeRepository.findOneBy({
              name: subtypeName,
              productType: cadenasType,
            });
            if (!subtype) {
              subtype = this.subtypeRepository.create({
                name: subtypeName,
                productType: cadenasType,
              });
              await this.subtypeRepository.save(subtype);
            }
          }
        }
      }
    }

    // Subtypes para Pulseras
    const pulserasSubtypes = [
      'Exclusivas e importadas',
      'Piedras naturales',
      'Elastizadas',
      'Plata lisa',
      'Nacar y perla',
      'Cristales',
      'Cubic y micro',
      'Esclavas',
      'Con dijes',
      'Gamuzas y cueros',
      'Plata y oro',
      'Hombres',
    ];

    for (const category of [plata925, oro18k, enchapados]) {
      if (category) {
        const pulserasType = await this.productTypeRepository.findOneBy({
          name: 'Pulseras',
          category,
        });
        if (pulserasType) {
          for (const subtypeName of pulserasSubtypes) {
            let subtype = await this.subtypeRepository.findOneBy({
              name: subtypeName,
              productType: pulserasType,
            });
            if (!subtype) {
              subtype = this.subtypeRepository.create({
                name: subtypeName,
                productType: pulserasType,
              });
              await this.subtypeRepository.save(subtype);
            }
          }
        }
      }
    }

    // Subtypes para Dijes
    const dijesSubtypes = [
      'Para grabar',
      'Cristales',
      'Religiosos',
      'Esmaltados',
      'Exclusivos e importantes',
      'Piedras',
      'Inflados',
      'Cubic y micro',
      'Liso',
      'Iniciales',
      'Otros',
    ];

    for (const category of [plata925, oro18k, enchapados]) {
      if (category) {
        const dijesType = await this.productTypeRepository.findOneBy({
          name: 'Dijes',
          category,
        });
        if (dijesType) {
          for (const subtypeName of dijesSubtypes) {
            let subtype = await this.subtypeRepository.findOneBy({
              name: subtypeName,
              productType: dijesType,
            });
            if (!subtype) {
              subtype = this.subtypeRepository.create({
                name: subtypeName,
                productType: dijesType,
              });
              await this.subtypeRepository.save(subtype);
            }
          }
        }
      }
    }

    return {
      message:
        'Seeding complete - All categories, product types, and subtypes created',
    };
  }

  async getCategories() {
    return this.categoryRepository.find();
  }

  async getProductTypes() {
    return this.productTypeRepository.find({ relations: ['category'] });
  }

  async getSubtypes() {
    return this.subtypeRepository.find({
      relations: ['productType', 'productType.category'],
    });
  }

  async seedProducts() {
    // Obtener categorías y tipos necesarios
    const plata925 = await this.categoryRepository.findOneBy({
      name: 'Plata 925',
    });
    const oro18k = await this.categoryRepository.findOneBy({
      name: 'Oro 18 k',
    });
    const enchapados = await this.categoryRepository.findOneBy({
      name: 'Enchapados',
    });

    if (!plata925 || !oro18k || !enchapados) {
      throw new NotFoundException(
        'Debes ejecutar el seed principal primero (POST /products/seed)',
      );
    }

    // Obtener tipos de productos
    const anillosPlata = await this.productTypeRepository.findOne({
      where: { name: 'Anillos', category: { id: plata925.id } },
    });
    const arosPlata = await this.productTypeRepository.findOne({
      where: { name: 'Aros', category: { id: plata925.id } },
    });
    const cadenasOro = await this.productTypeRepository.findOne({
      where: { name: 'Cadenas', category: { id: oro18k.id } },
    });
    const pulserasPlata = await this.productTypeRepository.findOne({
      where: { name: 'Pulseras', category: { id: plata925.id } },
    });
    const dijesEnchapados = await this.productTypeRepository.findOne({
      where: { name: 'Dijes', category: { id: enchapados.id } },
    });

    if (
      !anillosPlata ||
      !arosPlata ||
      !cadenasOro ||
      !pulserasPlata ||
      !dijesEnchapados
    ) {
      throw new NotFoundException(
        'Tipos de productos no encontrados. Ejecuta el seed principal primero.',
      );
    }

    // Obtener algunos subtipos
    const piedrasNaturales = await this.subtypeRepository.findOne({
      where: {
        name: 'Piedras naturales',
        productType: { id: anillosPlata.id },
      },
    });
    const colgantes = await this.subtypeRepository.findOne({
      where: { name: 'Colgantes', productType: { id: arosPlata.id } },
    });
    const exclusivas = await this.subtypeRepository.findOne({
      where: {
        name: 'Exclusivas e importante',
        productType: { id: cadenasOro.id },
      },
    });

    // Productos de ejemplo
    const sampleProducts = [
      {
        name: 'Anillo Solitario con Amatista',
        description:
          'Elegante anillo de plata 925 con amatista natural de 6mm, diseño clásico',
        price: 48000,
        imageUrl: 'https://ejemplo.com/anillo-amatista.jpg',
        category: plata925,
        productType: anillosPlata,
        subtype: piedrasNaturales || null,
      },
      {
        name: 'Aros Colgantes Estrella y Luna',
        description:
          'Hermosos aros de plata 925 con diseño de estrella y luna, largo 3.5cm',
        price: 35000,
        imageUrl: 'https://ejemplo.com/aros-estrella-luna.jpg',
        category: plata925,
        productType: arosPlata,
        subtype: colgantes || null,
      },
      {
        name: 'Cadena Oro Eslabón Cubano 50cm',
        description:
          'Cadena de oro 18k estilo cubano, 50cm de largo, 4mm de grosor',
        price: 950000,
        imageUrl: 'https://ejemplo.com/cadena-oro-cubano.jpg',
        category: oro18k,
        productType: cadenasOro,
        subtype: exclusivas || null,
      },
      {
        name: 'Pulsera Plata con Circones',
        description: 'Pulsera de plata 925 con circones brillantes, ajustable',
        price: 42000,
        imageUrl: 'https://ejemplo.com/pulsera-circones.jpg',
        category: plata925,
        productType: pulserasPlata,
        subtype: null,
      },
      {
        name: 'Dije Corazón Enchapado',
        description:
          'Dije en forma de corazón enchapado en oro, perfecto para regalo',
        price: 15000,
        imageUrl: 'https://ejemplo.com/dije-corazon.jpg',
        category: enchapados,
        productType: dijesEnchapados,
        subtype: null,
      },
      {
        name: 'Anillo Infinito Plata Lisa',
        description:
          'Anillo de plata 925 con diseño de infinito, acabado pulido',
        price: 28000,
        imageUrl: 'https://ejemplo.com/anillo-infinito.jpg',
        category: plata925,
        productType: anillosPlata,
        subtype: null,
      },
      {
        name: 'Aros Argolla Clásicos 2cm',
        description: 'Aros argolla de plata 925, diseño clásico, diámetro 2cm',
        price: 25000,
        imageUrl: 'https://ejemplo.com/aros-argolla.jpg',
        category: plata925,
        productType: arosPlata,
        subtype: null,
      },
      {
        name: 'Cadena Oro Fina 45cm',
        description: 'Cadena fina de oro 18k, perfecta para dijes, 45cm',
        price: 680000,
        imageUrl: 'https://ejemplo.com/cadena-oro-fina.jpg',
        category: oro18k,
        productType: cadenasOro,
        subtype: null,
      },
      {
        name: 'Pulsera Elastizada con Perlas',
        description: 'Pulsera de plata 925 elastizada con perlas cultivadas',
        price: 38000,
        imageUrl: 'https://ejemplo.com/pulsera-perlas.jpg',
        category: plata925,
        productType: pulserasPlata,
        subtype: null,
      },
      {
        name: 'Anillo Compromiso Cubic Zirconia',
        description:
          'Anillo de compromiso en plata 925 con cubic zirconia de 7mm',
        price: 55000,
        imageUrl: 'https://ejemplo.com/anillo-compromiso.jpg',
        category: plata925,
        productType: anillosPlata,
        subtype: null,
      },
    ];

    const createdProducts: Product[] = [];
    for (const productData of sampleProducts) {
      // Verificar si ya existe
      const existing = await this.productRepository.findOne({
        where: {
          name: productData.name,
        },
      });

      if (!existing) {
        const product = this.productRepository.create(productData);
        const saved = await this.productRepository.save(product);
        createdProducts.push(saved);
      }
    }

    return {
      message: `Seed de productos completado. ${createdProducts.length} productos creados.`,
      products: createdProducts,
    };
  }
}
