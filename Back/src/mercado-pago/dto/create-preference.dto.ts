import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreatePreferenceDto {
  @ApiProperty({ description: 'ID of the product to buy', example: 'uuid-v4' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'ID of the user buying the product', example: 'uuid-v4' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Quantity of products', example: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}
