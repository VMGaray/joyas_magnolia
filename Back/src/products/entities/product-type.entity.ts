import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { Subtype } from './subtype.entity';
import { Product } from './product.entity';

@Entity()
export class ProductType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.types)
  category: Category;

  @OneToMany(() => Subtype, (subtype) => subtype.productType)
  subtypes: Subtype[];

  @OneToMany(() => Product, (product) => product.productType)
  products: Product[];
}
