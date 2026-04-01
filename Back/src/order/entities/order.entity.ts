import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Auth } from '../../auth/entities/auth.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../order-status.enum';
import { ShippingMethod } from '../shipping-method.enum';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'enum', enum: ShippingMethod, default: ShippingMethod.NACIONAL })
  shippingMethod: ShippingMethod;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  shippingAddress: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  shippingCity: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  shippingZipCode: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  shippingState: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  recipientPhone: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  recipientName: string;

  @ManyToOne(() => Auth, (user) => user.orders)
  user: Auth;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];
}
