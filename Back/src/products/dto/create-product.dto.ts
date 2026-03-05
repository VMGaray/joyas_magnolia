import { ApiProperty } from '@nestjs/swagger';
import { BraceletsSubtypes, Category, ChainsSubtypes, EarringsSubtypes, PendantsSubtypes, ProductType, RingsSubtypes } from '../clasification.enum';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Anillo de Plata con Circón',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Hermoso anillo de plata 925 con circón brillante',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 45000,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Stock disponible',
    example: 10,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    description: 'Categoría del producto',
    enum: Category,
    example: Category.Silver925,
  })
  @IsEnum(Category)
  category: Category;

  @ApiProperty({
    description: 'Tipo de producto',
    enum: ProductType,
    example: ProductType.Rings,
  })
  @IsEnum(ProductType)
  productType: ProductType;

  @ApiProperty({
    description: 'Subtipo para Anillos',
    enum: RingsSubtypes,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnum(RingsSubtypes)
  rings_subtype?: RingsSubtypes;

  @ApiProperty({
    description: 'Subtipo para Aros',
    enum: EarringsSubtypes,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnum(EarringsSubtypes)
  earrings_subtype?: EarringsSubtypes;

  @ApiProperty({
    description: 'Subtipo para Cadenas',
    enum: ChainsSubtypes,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnum(ChainsSubtypes)
  chains_subtype?: ChainsSubtypes;

  @ApiProperty({
    description: 'Subtipo para Pulseras',
    enum: BraceletsSubtypes,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnum(BraceletsSubtypes)
  bracelets_subtype?: BraceletsSubtypes;

  @ApiProperty({
    description: 'Subtipo para Dijes',
    enum: PendantsSubtypes,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnum(PendantsSubtypes)
  pendants_subtype?: PendantsSubtypes;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Archivo de imagen del producto',
    required: false,
  })
  @IsOptional()
  file?: any;

  @ApiProperty({
    description: 'Etiquetas del producto (ej: Nuevo, Resaltado, Oferta)',
    type: [String],
    required: false,
    example: ['Nuevo', 'Resaltado'],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0);
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
