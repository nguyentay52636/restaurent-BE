import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => Order, (order) => order.review, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  order: Order;

  @ManyToOne(() => Product, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'int', comment: 'Số điểm từ 1 đến 5' })
  rating: number;

  @Column({ type: 'text', comment: 'Nội dung đánh giá', name: 'comment' })
  comment: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
