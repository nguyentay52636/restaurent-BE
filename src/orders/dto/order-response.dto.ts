import { OrderItemResponseDto } from './order-item-response.dto';

export class UserDto {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  points: number;
  roleId: number;
  createdAt: Date;
  updatedAt: Date;
}

export class OrderResponseDto {
  id: number;
  status: string;
  user: UserDto;
  orderItems: OrderItemResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}
