import { OrderItemResponseDto } from './order-item-response.dto';

export class OrderResponseDto {
  id: number;
  status: string;
  userId: number;
  orderItems: OrderItemResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}
