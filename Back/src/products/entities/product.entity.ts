import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from './category.entity';
import { ProductType } from './product-type.entity';
import { Subtype } from './subtype.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal')
  price: number;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToOne(() => ProductType, (productType) => productType.products)
  productType: ProductType;

  @ManyToOne(() => Subtype, (subtype) => subtype.products, { nullable: true })
  subtype: Subtype | null;
}
