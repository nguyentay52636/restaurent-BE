import { OrderResponseDto } from '../../orders/dto/order-response.dto';

export class PaymentResponseDto {
  id: number;
  orderId: number;
  order: OrderResponseDto;
  paymentMethod: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
