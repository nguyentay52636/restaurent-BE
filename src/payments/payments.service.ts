import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from 'src/orders/entities/order.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  private toResponseDto(payment: Payment): PaymentResponseDto {
    return {
      id: payment.id,
      orderId: payment.order.id,
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }

  async create(dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id: dto.orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    const payment = this.paymentRepository.create({
      ...dto,
      order,
    });

    const saved = await this.paymentRepository.save(payment);
    return this.toResponseDto(saved);
  }

  async findAll(): Promise<PaymentResponseDto[]> {
    const payments = await this.paymentRepository.find({
      relations: ['order'],
    });
    return payments.map(this.toResponseDto);
  }

  async findOne(id: number): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['order'],
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return this.toResponseDto(payment);
  }

  async update(id: number, dto: UpdatePaymentDto): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['order'],
    });
    if (!payment) throw new NotFoundException('Payment not found');

    const updated = this.paymentRepository.merge(payment, dto);
    const saved = await this.paymentRepository.save(updated);
    return this.toResponseDto(saved);
  }

  async remove(id: number): Promise<void> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');
    await this.paymentRepository.remove(payment);
  }
}
