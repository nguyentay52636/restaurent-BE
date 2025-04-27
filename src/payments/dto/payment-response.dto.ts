export class PaymentResponseDto {
  id: number;
  orderId: number;
  paymentMethod: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
