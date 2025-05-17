import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async create(dto: CreateReservationDto) {
    const { userId, orderId, tableIds } = dto;
    const reservationTime = new Date();

    const activeReservations = await this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.tables', 'table')
      .where('reservation.reservation_time = :reservationTime', {
        reservationTime,
      })
      .andWhere('reservation.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: [
          ReservationStatus.CANCELED,
          ReservationStatus.COMPLETED,
        ],
      })
      .andWhere('table.id IN (:...tableIds)', { tableIds })
      .getMany();

    const conflictTableIds = new Set<number>();
    activeReservations.forEach((reservation) =>
      reservation.tables.forEach((table) => {
        if (tableIds.includes(table.id)) {
          conflictTableIds.add(table.id);
        }
      }),
    );

    if (conflictTableIds.size > 0) {
      throw new Error(`Bàn đang được đặt: ${[...conflictTableIds].join(', ')}`);
    }

    const reservation = this.reservationRepository.create({
      reservation_time: reservationTime,
      status: ReservationStatus.PENDING,
      user: { id: userId },
      orders: [{ id: orderId }],
      tables: tableIds.map((id) => ({ id })),
    });

    return this.reservationRepository.save(reservation);
  }

  async findAll() {
    return this.reservationRepository.find({
      relations: [
        'user',
        'orders',
        'tables',
        'orders.orderItems',
        'orders.payments',
      ],
    });
  }

  async findOne(id: number) {
    const res = await this.reservationRepository.findOne({
      where: { id },
      relations: [
        'user',
        'orders',
        'tables',
        'orders.orderItems',
        'orders.payments',
      ],
    });
    if (!res) throw new NotFoundException('Không tìm thấy đặt bàn');
    return res;
  }

  async update(id: number, dto: UpdateReservationDto) {
    const existing = await this.findOne(id);
    const updated = Object.assign(existing, {
      ...dto,
      ...(dto.userId && { user: { id: dto.userId } }),
    });
    return this.reservationRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['orders', 'tables'],
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }

    // Xóa quan hệ với orders và tables trước (nếu cần rõ ràng)
    reservation.orders = [];
    reservation.tables = [];
    await this.reservationRepository.save(reservation);

    // Sau đó xóa reservation chính
    await this.reservationRepository.delete(id);
  }

  async updateStatus(id: number, status: ReservationStatus) {
    const reservation = await this.findOne(id);
    reservation.status = status;
    return this.reservationRepository.save(reservation);
  }
}
