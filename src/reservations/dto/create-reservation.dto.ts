import {
  IsDateString,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateReservationDto {
  @IsNumber()
  userId: number;

  @IsDateString()
  reservation_time: Date;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  tableIds: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  orderId: number;
}
