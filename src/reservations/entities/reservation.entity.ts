import { Order } from 'src/orders/entities/order.entity';
import { Table } from 'src/tables/entities/table.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
  CHECKED_IN = 'checked_in',
  NO_SHOW = 'no_show',
  COMPLETED = 'completed',
}

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reservations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'timestamp', comment: 'Thời gian đặt bàn' })
  reservation_time: Date;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
    comment: 'pending | confirmed | canceled',
  })
  status: ReservationStatus;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToMany(() => Order, (order) => order.reservations, { cascade: true })
  @JoinTable({
    name: 'reservation_items',
    joinColumn: { name: 'reservation_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'order_id', referencedColumnName: 'id' },
  })
  orders: Order[];

  @ManyToMany(() => Table, (table) => table.reservations)
  @JoinTable({
    name: 'reservation_tables',
    joinColumn: {
      name: 'reservation_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'table_id',
      referencedColumnName: 'id',
    },
  })
  tables: Table[];
}
