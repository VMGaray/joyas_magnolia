import { Controller, Get, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('metrics/sales')
  @ApiOperation({ summary: 'Get sales total per month or for a specific month' })
  @ApiQuery({ name: 'year', required: false, type: Number, description: 'Year to get sales from (defaults to current year)' })
  @ApiQuery({ name: 'month', required: false, type: Number, description: 'Optional: Specific month (1-12) to get sales from' })
  getSales(@Query('year') year?: string, @Query('month') month?: string) {
    const yearNum = year ? parseInt(year) : undefined;
    const monthNum = month ? parseInt(month) : undefined;
    return this.adminService.getSalesByMonth(yearNum, monthNum);
  }

  @Get('metrics/orders')
  @ApiOperation({ summary: 'Get order counts grouped by status' })
  @ApiQuery({ name: 'period', required: false, enum: ['day', 'week', 'month'], description: 'Optional time period filter' })
  getOrderMetrics(@Query('period') period?: 'day' | 'week' | 'month') {
    return this.adminService.getOrderStatusMetrics(period);
  }
}
