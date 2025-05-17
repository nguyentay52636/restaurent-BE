import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity('tables')
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'Tên bàn: B1, B2,...' })
  name: string;

  @Column({ comment: 'Sức chứa của bàn' })
  seats: number;

  @ManyToMany(() => Reservation, (reservation) => reservation.tables)
  reservations: Reservation[];
}
