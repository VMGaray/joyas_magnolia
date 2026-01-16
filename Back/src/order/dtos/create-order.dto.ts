import { IsArray, IsNotEmpty, IsNumber, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ description: 'ID of the product', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Quantity of the product', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'ID of the user creating the order', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'List of products in the order',
    type: [OrderItemDto],
    example: [
      {
        productId: '550e8400-e29b-41d4-a716-446655440000',
        quantity: 2
      },
      {
        productId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        quantity: 1
      }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
