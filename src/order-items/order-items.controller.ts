import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItemResponseDto } from './dto/order-item-response.dto';
import { OrderItemsService } from 'src/order-items/order-items.service';

@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post()
  create(@Body() dto: CreateOrderItemDto): Promise<OrderItemResponseDto> {
    return this.orderItemsService.create(dto);
  }

  @Get()
  findAll(): Promise<OrderItemResponseDto[]> {
    return this.orderItemsService.findAll();
  }

  @Get('order/:orderId')
  findByOrderId(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<OrderItemResponseDto[]> {
    return this.orderItemsService.findByOrderId(orderId);
  }

  @Get(':orderId/:productId')
  findOne(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<OrderItemResponseDto> {
    return this.orderItemsService.findOne(orderId, productId);
  }

  @Patch(':orderId/:productId')
  update(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: UpdateOrderItemDto,
  ): Promise<OrderItemResponseDto> {
    return this.orderItemsService.update(orderId, productId, dto);
  }

  @Delete(':orderId/:productId')
  remove(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<void> {
    return this.orderItemsService.remove(orderId, productId);
  }
}
