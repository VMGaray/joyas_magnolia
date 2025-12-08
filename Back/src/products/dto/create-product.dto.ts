import { ApiProperty } from '@nestjs/swagger';


export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Anillo de Plata con Circón',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Hermoso anillo de plata 925 con circón brillante',
  })
  description: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 45000,
  })
  price: number;

  @ApiProperty({
    description: 'URL de la imagen del producto',
    example: 'https://example.com/images/anillo.jpg',
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'ID de la categoría del producto',
    example: 1,
  })
  categoryId: number;

  @ApiProperty({
    description: 'ID del tipo de producto',
    example: 1,
  })
  productTypeId: number;

  @ApiProperty({
    description: 'ID del subtipo de producto',
    example: 1,
    required: false,
  })
  subtypeId?: number;
}
