import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { Auth } from '../auth/entities/auth.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderStatus } from './order-status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, items } = createOrderDto;

    const user = await this.authRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    let totalPrice = 0;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const product = await this.productRepository.findOneBy({ id: item.productId });
      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${product.name}`);
      }

      const orderItem = this.orderItemRepository.create({
        product,
        quantity: item.quantity,
        price: product.price,
      });

      totalPrice += product.price * item.quantity;
      orderItems.push(orderItem);
    }

    const order = this.orderRepository.create({
      user,
      items: orderItems,
      totalPrice,
      status: OrderStatus.PENDING,
    });

    return await this.orderRepository.save(order);
  }

  async getOrderById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.getOrderById(id);
    order.status = status;
    return await this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['user', 'items'],
    });
  }
}
