import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new purchase order' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all purchase orders' })
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details by ID' })
  findOne(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get order status by ID' })
  async getStatus(@Param('id') id: string) {
    const order = await this.orderService.getOrderById(id);
    return { status: order.status };
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(id, updateOrderStatusDto.status);
  }
}
