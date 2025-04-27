import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { OrderItem } from 'src/order-items/entities/order-item.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Review } from 'src/reviews/entities/review.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'status', type: 'varchar' })
  status: string;

  @ManyToOne(() => User, (user) => user.orders, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    comment: 'Timestamp when order data was last updated',
  })
  updatedAt: Date;

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];

  @OneToOne(() => Review, (review) => review.order)
  review: Review;
}
