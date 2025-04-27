import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async create(dto: CreateReservationDto) {
    const reservation = this.reservationRepository.create({
      ...dto,
      user: { id: dto.userId },
    });
    return this.reservationRepository.save(reservation);
  }

  async findAll() {
    return this.reservationRepository.find({ relations: ['user'] });
  }

  async findOne(id: number) {
    const res = await this.reservationRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!res) throw new NotFoundException('Reservation not found');
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

  async remove(id: number) {
    const reservation = await this.findOne(id);
    return this.reservationRepository.remove(reservation);
  }
}
