import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { OrderItemResponseDto } from './dto/order-item-response.dto';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  private toResponseDto(item: OrderItem): OrderItemResponseDto {
    return {
      orderId: item.orderId,
      productId: item.productId,
      quantity: item.quantity,
      price: +item.price,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  async create(dto: CreateOrderItemDto): Promise<OrderItemResponseDto> {
    const order = await this.orderRepo.findOne({ where: { id: dto.orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    const existing = await this.orderItemRepo.findOne({
      where: { orderId: dto.orderId, productId: dto.productId },
    });
    if (existing) throw new Error('Order item already exists');

    const newItem = this.orderItemRepo.create({
      order,
      product,
      orderId: dto.orderId,
      productId: dto.productId,
      quantity: dto.quantity,
      price: dto.price,
    });

    const saved = await this.orderItemRepo.save(newItem);
    return this.toResponseDto(saved);
  }

  async findAll(): Promise<OrderItemResponseDto[]> {
    const items = await this.orderItemRepo.find();
    return items.map(this.toResponseDto);
  }

  async findByOrderId(orderId: number): Promise<OrderItemResponseDto[]> {
    const items = await this.orderItemRepo.find({ where: { orderId } });
    return items.map(this.toResponseDto);
  }

  async findOne(
    orderId: number,
    productId: number,
  ): Promise<OrderItemResponseDto> {
    const item = await this.orderItemRepo.findOne({
      where: { orderId, productId },
    });
    if (!item) throw new NotFoundException('Order item not found');
    return this.toResponseDto(item);
  }

  async update(
    orderId: number,
    productId: number,
    dto: UpdateOrderItemDto,
  ): Promise<OrderItemResponseDto> {
    const item = await this.orderItemRepo.findOne({
      where: { orderId, productId },
    });
    if (!item) throw new NotFoundException('Order item not found');

    const updated = this.orderItemRepo.merge(item, dto);
    const saved = await this.orderItemRepo.save(updated);
    return this.toResponseDto(saved);
  }

  async remove(orderId: number, productId: number): Promise<void> {
    const item = await this.orderItemRepo.findOne({
      where: { orderId, productId },
    });
    if (!item) throw new NotFoundException('Order item not found');

    await this.orderItemRepo.remove(item);
  }
}
