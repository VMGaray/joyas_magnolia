import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { Category, ProductType } from '../clasification.enum';

export class FilterProductsDto {
  @ApiProperty({
    description: 'Filtrar por categoría',
    enum: Category,
    required: false,
  })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @ApiProperty({
    description: 'Filtrar por tipo de producto',
    enum: ProductType,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @ApiProperty({
    description: 'Filtrar por subtipo (genérico)',
    required: false,
  })
  @IsOptional()
  subtype?: string;

  @ApiProperty({
    description: 'Filtrar por una o más etiquetas (separadas por coma)',
    required: false,
    example: 'Nuevo,Oferta',
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

  @ApiProperty({
    description: 'Número de página. Si no se envía, se devuelven todos los productos sin paginar.',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Cantidad de productos por página. Si no se envía, no se aplica límite (se devuelven todos los productos).',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  limit?: number;
}
