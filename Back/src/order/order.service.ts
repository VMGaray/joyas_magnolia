import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { Auth } from '../auth/entities/auth.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderStatus } from './order-status.enum';
import { ShippingMethod } from './shipping-method.enum';

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
    const { 
      userId, 
      items, 
      shippingAddress, 
      shippingCity, 
      shippingZipCode, 
      shippingState, 
      recipientPhone, 
      recipientName,
      shippingMethod
    } = createOrderDto;

    const user = await this.authRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const productIds = items.map((item) => item.productId);
    const products = await this.productRepository.findBy({ id: In(productIds) });

    if (products.length !== items.length) {
      const foundIds = products.map((p) => p.id);
      const missingIds = productIds.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(`Products with IDs ${missingIds.join(', ')} not found`);
    }

    let totalPrice = 0;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        // This should not happen due to the validation above, but satisfies TS
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
      shippingAddress: shippingAddress || user.address,
      shippingCity: shippingCity || user.city,
      shippingZipCode: shippingZipCode || user.zipCode,
      shippingState: shippingState || user.state,
      recipientPhone: recipientPhone || user.phone?.toString(),
      recipientName: recipientName || user.username,
      shippingMethod: shippingMethod || ShippingMethod.NACIONAL,
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

  async addProductToOrder(orderId: string, productId: string, quantity: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product', 'user'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(`Cannot update order with status ${order.status}. Only PENDING orders can be updated.`);
    }

    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    if (product.stock < quantity) {
      throw new BadRequestException(`Insufficient stock for product ${product.name}`);
    }

    let orderItem = order.items.find((item) => item.product.id === productId);

    if (orderItem) {
      orderItem.quantity += quantity;
      await this.orderItemRepository.save(orderItem);
    } else {
      orderItem = this.orderItemRepository.create({
        product,
        quantity,
        price: product.price,
        order,
      });
      await this.orderItemRepository.save(orderItem);
      order.items.push(orderItem);
    }

    // Recalculate total price
    order.totalPrice = order.items.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

    return await this.orderRepository.save(order);
  }

  async removeProductFromOrder(orderId: string, productId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product', 'user'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(`Cannot update order with status ${order.status}. Only PENDING orders can be updated.`);
    }

    const itemToRemove = order.items.find((item) => item.product.id === productId);
    if (!itemToRemove) {
      throw new NotFoundException(`Product with ID ${productId} not found in this order`);
    }

    await this.orderItemRepository.remove(itemToRemove);
    order.items = order.items.filter((item) => item.product.id !== productId);

    // Recalculate total price
    order.totalPrice = order.items.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

    return await this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['user', 'items'],
    });
  }

  getShippingMethods(): string[] {
    return Object.values(ShippingMethod);
  }
}
