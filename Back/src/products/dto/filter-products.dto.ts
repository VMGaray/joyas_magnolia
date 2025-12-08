import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class FilterProductsDto {
  @ApiProperty({
    description: 'Filtrar por nombre de categoría',
    example: 'Plata 925',
    required: false,
  })
  category?: string;

  @ApiProperty({
    description: 'Filtrar por nombre de tipo de producto',
    example: 'Anillos',
    required: false,
  })
  type?: string;

  @ApiProperty({
    description: 'Filtrar por nombre de subtipo',
    example: 'Piedras naturales',
    required: false,
  })
  subtype?: string;

  @ApiProperty({
    description: 'Número de página',
    example: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Cantidad de productos por página',
    example: 10,
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  limit?: number = 10;
}
