import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private toResponseDto(order: Order): OrderResponseDto {
    return {
      id: order.id,
      status: order.status,
      userId: order.user.id,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  async create(dto: CreateOrderDto): Promise<OrderResponseDto> {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const newOrder = this.orderRepo.create({
      ...dto,
      user,
    });

    const saved = await this.orderRepo.save(newOrder);
    return this.toResponseDto(saved);
  }

  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepo.find();
    return orders.map(this.toResponseDto);
  }

  async findOne(id: number): Promise<OrderResponseDto> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return this.toResponseDto(order);
  }

  async update(id: number, dto: UpdateOrderDto): Promise<OrderResponseDto> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!order) throw new NotFoundException('Order not found');

    const updated = this.orderRepo.merge(order, dto);
    const saved = await this.orderRepo.save(updated);
    return this.toResponseDto(saved);
  }

  async remove(id: number): Promise<void> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    await this.orderRepo.remove(order);
  }
}
