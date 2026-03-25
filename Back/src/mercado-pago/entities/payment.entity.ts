import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Auth } from '../../auth/entities/auth.entity';
import { Order } from '../../order/entities/order.entity';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  externalReference: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  paymentId: string | null;

  @ManyToOne(() => Auth)
  user: Auth;

  @OneToOne(() => Order)
  @JoinColumn()
  order: Order;

  @CreateDateColumn()
  createdAt: Date;
}
