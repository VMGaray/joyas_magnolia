import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MercadoPagoConfig, Preference, Payment as MPPayment } from 'mercadopago';
import { Payment } from './entities/payment.entity';
import { Product } from '../products/entities/product.entity';
import { Auth } from '../auth/entities/auth.entity';
import { CreatePreferenceDto } from './dto/create-preference.dto';

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
  ) {
    const accessToken = this.configService.get<string>('MP_ACCESS_TOKEN');
    this.client = new MercadoPagoConfig({
      accessToken: accessToken || '',
      options: { timeout: 5000 },
    });
  }

  async createPreference(createPreferenceDto: CreatePreferenceDto) {
    const { productId, userId, quantity } = createPreferenceDto;

    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) throw new NotFoundException('Product not found');

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
          items: [
            {
              id: product.id,
              title: product.name,
              unit_price: Number(product.price),
              quantity: quantity,
              currency_id: 'ARS',
            },
          ],
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
          external_reference: `${userId}#${productId}`,
        },
      });

      // Guardar el pago inicial en la base de datos
      const newPayment = this.paymentRepository.create({
        amount: Number(product.price) * quantity,
        status: 'pending',
        externalReference: response.external_reference,
        user: user,
        product: product,
      });
      await this.paymentRepository.save(newPayment);

      return {
        id: response.id,
        init_point: response.init_point,
      };
    } catch (error: any) {
      // Devolver el error de Mercado Pago al cliente
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
          relations: ['user', 'product'],
        });

        if (payment) {
          payment.status = paymentData.status || 'unknown';
          payment.paymentId = paymentId.toString();
          await this.paymentRepository.save(payment);
        }
      }
    }
    return { received: true };
  }
}
