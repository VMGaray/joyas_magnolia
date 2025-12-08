import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ProductType } from './product-type.entity';
import { Product } from './product.entity';

@Entity()
export class Subtype {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => ProductType, (productType) => productType.subtypes)
  productType: ProductType;

  @OneToMany(() => Product, (product) => product.subtype)
  products: Product[];
}
