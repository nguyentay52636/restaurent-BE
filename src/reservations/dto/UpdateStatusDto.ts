import { IsEnum } from 'class-validator';
import { ReservationStatus } from 'src/reservations/entities/reservation.entity';

export class UpdateStatusDto {
  @IsEnum(ReservationStatus, {
    message: `Status must be one of: ${Object.values(ReservationStatus).join(', ')}`,
  })
  status: ReservationStatus;
}
