import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from './category.entity';
import { ProductType } from './product-type.entity';
import { Subtype } from './subtype.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal')
  price: number;

  @Column({nullable: true})
  isFeatured: boolean;

  @Column({ type: 'text', nullable: true })
  imageUrl: string | null;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToOne(() => ProductType, (productType) => productType.products)
  productType: ProductType;

  @ManyToOne(() => Subtype, (subtype) => subtype.products, { nullable: true })
  subtype: Subtype | null;
}
