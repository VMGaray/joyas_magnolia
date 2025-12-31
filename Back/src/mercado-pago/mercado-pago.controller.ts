import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MercadoPagoService } from './mercado-pago.service';
import { CreatePreferenceDto } from './dto/create-preference.dto';

@ApiTags('mercado-pago')
@Controller('mercado-pago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  @Post('create-preference')
  @ApiOperation({ summary: 'Create a Mercado Pago payment preference' })
  @ApiResponse({ status: 201, description: 'Preference created successfully' })
  @ApiResponse({ status: 404, description: 'Product or User not found' })
  async createPreference(@Body() createPreferenceDto: CreatePreferenceDto) {
    return this.mercadoPagoService.createPreference(createPreferenceDto);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Mercado Pago webhook notifications' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async handleWebhook(@Body() data: any) {
    return this.mercadoPagoService.handleWebhook(data);
  }
}
