import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty({
    description: 'Puntuación del producto (1-5)',
    example: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @ApiProperty({
    description: 'Comentario opcional sobre el producto',
    example: 'Excelente calidad y diseño.',
    required: false,
  })
  @IsString()
  @IsOptional()
  comment?: string;
}
