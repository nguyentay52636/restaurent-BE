import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsInt()
  orderId: number;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}
