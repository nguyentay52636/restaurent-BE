import { IsEnum, IsDateString, IsNumber } from 'class-validator';
import { ReservationStatus } from '../entities/reservation.entity';

export class CreateReservationDto {
  @IsNumber()
  userId: number;

  @IsDateString()
  reservation_time: Date;

  @IsEnum(ReservationStatus)
  status: ReservationStatus;
}
