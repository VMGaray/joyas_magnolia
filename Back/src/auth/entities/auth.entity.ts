import { ProductRating } from 'src/product-ratings/entities/product-rating.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Order } from '../../order/entities/order.entity';

@Entity({ name: 'auth' })
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  username: string;

  @Column({ type: 'bigint', nullable: false })
  phone: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @Column({ type: 'varchar', length: 150, nullable: true })
  address: string;

  @OneToMany(() => ProductRating, (rating) => rating.user)
  ratings: ProductRating[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
