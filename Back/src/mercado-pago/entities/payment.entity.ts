import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Auth } from '../../auth/entities/auth.entity';
import { Product } from '../../products/entities/product.entity';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  externalReference: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  paymentId: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @ManyToOne(() => Auth)
  user: Auth;

  @ManyToOne(() => Product)
  product: Product;

  @CreateDateColumn()
  createdAt: Date;
}
