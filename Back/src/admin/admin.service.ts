import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Payment } from '../mercado-pago/entities/payment.entity';
import { Order } from '../order/entities/order.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async getSalesByMonth(year?: number, month?: number) {
    const targetYear = year || new Date().getFullYear();
    
    const query = this.paymentRepository
      .createQueryBuilder('payment')
      .select("DATE_TRUNC('month', payment.createdAt)", 'month')
      .addSelect('SUM(payment.amount)', 'total')
      .where('payment.status = :status', { status: 'approved' })
      .andWhere('EXTRACT(YEAR FROM payment.createdAt) = :year', { year: targetYear });

    if (month) {
      query.andWhere('EXTRACT(MONTH FROM payment.createdAt) = :month', { month });
    }

    const sales = await query
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    if (month) {
      const total = sales.length > 0 ? parseFloat(sales[0].total) : 0;
      return {
        year: targetYear,
        month: month,
        total: total,
      };
    }

    // Initialize all 12 months with 0
    const monthlySales = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      total: 0,
    }));

    sales.forEach(sale => {
      const monthIdx = new Date(sale.month).getUTCMonth();
      monthlySales[monthIdx].total = parseFloat(sale.total);
    });

    return {
      year: targetYear,
      data: monthlySales,
    };
  }

  async getOrderStatusMetrics(period?: 'day' | 'week' | 'month') {
    const query = this.orderRepository.createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(*)', 'count');

    if (period) {
      let startDate = new Date();
      if (period === 'day') {
        startDate.setHours(0, 0, 0, 0);
      } else if (period === 'week') {
        const day = startDate.getDay();
        const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
        startDate.setDate(diff);
        startDate.setHours(0, 0, 0, 0);
      } else if (period === 'month') {
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
      }
      query.where('order.createdAt >= :startDate', { startDate });
    }

    const results = await query
      .groupBy('order.status')
      .getRawMany();

    return results.map(res => ({
      status: res.status,
      count: parseInt(res.count),
    }));
  }
}
