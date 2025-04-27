import { Order } from 'src/orders/entities/order.entity';
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from 'src/products/entities/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryColumn({ name: 'order_id', type: 'int' })
  orderId: number;

  @PrimaryColumn({ name: 'product_id', type: 'int' })
  productId: number;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    comment: 'Timestamp when order item data was last updated',
  })
  updatedAt: Date;
}
