import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from 'src/orders/entities/order.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { OrderResponseDto } from 'src/orders/dto/order-response.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  private toResponseDto(payment: Payment): PaymentResponseDto {
    const orderDto: OrderResponseDto = {
      id: payment.order.id,
      status: payment.order.status,
      user: {
        id: payment.order.user.id,
        fullName: payment.order.user.fullName,
        email: payment.order.user.email,
        phone: payment.order.user.phone,
        address: payment.order.user.address,
        points: payment.order.user.points,
        roleId: payment.order.user.roleId,
        createdAt: payment.order.user.createdAt,
        updatedAt: payment.order.user.updatedAt,
      },
      orderItems: payment.order.orderItems?.map(item => ({
        id: item.orderId,
        productId: item.productId,
        product: item.product ? {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          quantity: item.product.quantity,
          categoryId: item.product.category?.id,
          image: item.product.image,
          product_sizes: item.product.sizes ?? [],
          status: item.product.status,
          createdAt: item.product.createdAt,
          updatedAt: item.product.updatedAt,
        } : null,
        quantity: item.quantity,
        price: item.price,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })) || [],
      createdAt: payment.order.createdAt,
      updatedAt: payment.order.updatedAt,
    };

    return {
      id: payment.id,
      orderId: payment.order.id,
      order: orderDto,
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }

  async create(dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id: dto.orderId },
      relations: ['user', 'orderItems', 'orderItems.product', 'orderItems.product.category', 'orderItems.product.sizes'],
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
      relations: ['order', 'order.user', 'order.orderItems', 'order.orderItems.product', 'order.orderItems.product.category', 'order.orderItems.product.sizes'],
    });
    return payments.map(this.toResponseDto);
  }

  async findOne(id: number): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['order', 'order.user', 'order.orderItems', 'order.orderItems.product', 'order.orderItems.product.category', 'order.orderItems.product.sizes'],
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return this.toResponseDto(payment);
  }

  async update(id: number, dto: UpdatePaymentDto): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['order', 'order.user', 'order.orderItems', 'order.orderItems.product', 'order.orderItems.product.category', 'order.orderItems.product.sizes'],
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
