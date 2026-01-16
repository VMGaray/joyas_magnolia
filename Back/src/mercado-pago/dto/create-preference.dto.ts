import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePreferenceDto {
  @ApiProperty({ description: 'ID of the purchase order to pay', example: 'uuid-v4' })
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ description: 'ID of the user paying the order', example: 'uuid-v4' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
