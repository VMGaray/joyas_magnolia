import { Auth } from 'src/auth/entities/auth.entity';
import { Product } from 'src/products/entities/product.entity';
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  CreateDateColumn,
  UpdateDateColumn 
} from 'typeorm';

@Entity('product_ratings')
export class ProductRating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  rating: number; // 1-5

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @ManyToOne(() => Product, (product) => product.ratings, {
    onDelete: 'CASCADE'
  })
  product: Product;

  @ManyToOne(() => Auth, (user) => user.ratings, {
    onDelete: 'CASCADE'
  })
  user: Auth;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}