import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MercadoPagoConfig, Preference, Payment as MPPayment } from 'mercadopago';
import { Payment } from './entities/payment.entity';
import { Product } from '../products/entities/product.entity';
import { Auth } from '../auth/entities/auth.entity';
import { Order } from '../order/entities/order.entity';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { OrderStatus } from '../order/order-status.enum';

@Injectable()
export class MercadoPagoService {
  private client: MercadoPagoConfig;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {
    const accessToken = this.configService.get<string>('MP_ACCESS_TOKEN');
    this.client = new MercadoPagoConfig({
      accessToken: accessToken || '',
      options: { timeout: 5000 },
    });
  }

  async createPreference(createPreferenceDto: CreatePreferenceDto) {
    const { orderId, userId } = createPreferenceDto;

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product', 'user'],
    });
    if (!order) throw new NotFoundException('Order not found');

    const user = await this.authRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    // Validar URLs de retorno
    const successUrl = this.configService.get<string>('MP_SUCCESS_URL');
    const failureUrl = this.configService.get<string>('MP_FAILURE_URL');
    const notificationUrl = this.configService.get<string>('MP_NOTIFICATION_URL');

    if (!successUrl || !failureUrl || !notificationUrl) {
      throw new InternalServerErrorException(
        'Mercado Pago configuration error: MP_SUCCESS_URL, MP_FAILURE_URL or MP_NOTIFICATION_URL is not defined in .env',
      );
    }

    const preference = new Preference(this.client);

    try {
      const response = await preference.create({
        body: {
          items: order.items.map((item) => ({
            id: item.product.id,
            title: item.product.name,
            unit_price: Number(item.price),
            quantity: item.quantity,
            currency_id: 'ARS',
          })),
          payer: {
            email: user.email,
          },
          back_urls: {
            success: successUrl,
            failure: failureUrl,
            pending: successUrl,
          },
          auto_return: 'approved',
          notification_url: notificationUrl,
          external_reference: `${userId}#${orderId}`,
        },
      });

      // Guardar el pago inicial en la base de datos
      const newPayment = this.paymentRepository.create({
        amount: order.totalPrice,
        status: 'pending',
        externalReference: response.external_reference,
        user: user,
        order: order,
      });
      await this.paymentRepository.save(newPayment);

      return {
        id: response.id,
        init_point: response.init_point,
        sandbox_init_point: response.sandbox_init_point,
      };
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error';
      const errorCause = error.cause || error;
      throw new BadRequestException({
        message: `Mercado Pago Error: ${errorMessage}`,
        cause: errorCause,
      });
    }
  }

  async handleWebhook(data: any) {
    if (data.type === 'payment') {
      const paymentId = data.data.id;
      const mpPayment = new MPPayment(this.client);
      const paymentData = await mpPayment.get({ id: paymentId });

      const externalReference = paymentData.external_reference;
      if (externalReference) {
        const payment = await this.paymentRepository.findOne({
          where: { externalReference },
          relations: ['user', 'order', 'order.items', 'order.items.product'],
        });

        if (payment) {
          const previousStatus = payment.status;
          payment.status = paymentData.status || 'unknown';
          payment.paymentId = paymentId.toString();

          if (payment.status === 'approved' && previousStatus !== 'approved') {
            // Update order status
            const order = payment.order;
            if (order) {
              order.status = OrderStatus.PROCESSED;
              await this.orderRepository.save(order);

              // Deduct stock for all items in order
              for (const item of order.items) {
                const product = item.product;
                if (product) {
                  product.stock -= item.quantity;
                  await this.productRepository.save(product);
                }
              }
            }
          } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
            const order = payment.order;
            if (order) {
              order.status = OrderStatus.CANCELLED;
              await this.orderRepository.save(order);
            }
          }
          await this.paymentRepository.save(payment);
        }
      }
    }
    return { received: true };
  }
}
