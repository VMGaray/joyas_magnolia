import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductType } from './product-type.entity';
import { Product } from './product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => ProductType, (productType) => productType.category)
  types: ProductType[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
