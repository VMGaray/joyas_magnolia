import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { BraceletsSubtypes, Category, ChainsSubtypes, EarringsSubtypes, PendantsSubtypes, ProductType, RingsSubtypes } from '../clasification.enum';
import { ProductRating } from 'src/product-ratings/entities/product-rating.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column('decimal', { nullable: false })
  price: number;

  @Column({ type: 'int', nullable: false })
  stock: number;

  @Column({ nullable: true })
  isFeatured: boolean;

  @Column('decimal', { precision: 3, scale: 2, nullable: true })
  averageRating: number; // Promedio de puntuaciones

  @Column({ default: 0 })
  ratingCount: number; // Número de puntuaciones

  @OneToMany(() => ProductRating, (rating) => rating.product)
  ratings: ProductRating[];

  @Column({ type: 'text', nullable: true })
  imageUrl: string | null;

  @Column({ type: 'enum', enum: Category })
  category: Category;

  @Column({ type: 'enum', enum: ProductType })
  productType: ProductType;

  @Column({ type: 'enum', enum: RingsSubtypes, nullable: true })
  rings_subtype: RingsSubtypes | null;

  @Column({ type: 'enum', enum: EarringsSubtypes, nullable: true })
  earrings_subtype: EarringsSubtypes | null;

  @Column({ type: 'enum', enum: ChainsSubtypes, nullable: true })
  chains_subtype: ChainsSubtypes | null;

  @Column({ type: 'enum', enum: BraceletsSubtypes, nullable: true })
  bracelets_subtype: BraceletsSubtypes | null;

  @Column({ type: 'enum', enum: PendantsSubtypes, nullable: true })
  pendants_subtype: PendantsSubtypes | null;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;
}
