import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItemResponseDto } from './dto/order-item-response.dto';
import { OrderItemsService } from 'src/order-items/order-items.service';
import { Permissions } from 'src/permissions/decorator/permissions.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PermissionsGuard } from 'src/permissions/permissions.guard';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post()
  @Permissions('create:order-items')
  create(@Body() dto: CreateOrderItemDto): Promise<OrderItemResponseDto> {
    return this.orderItemsService.create(dto);
  }

  @Get()
  @Permissions('read:order-items')
  findAll(): Promise<OrderItemResponseDto[]> {
    return this.orderItemsService.findAll();
  }

  @Get('order/:orderId')
  @Permissions('read:order-items')
  findByOrderId(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<OrderItemResponseDto[]> {
    return this.orderItemsService.findByOrderId(orderId);
  }

  @Get(':orderId/:productId')
  @Permissions('read:order-items')
  findOne(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<OrderItemResponseDto> {
    return this.orderItemsService.findOne(orderId, productId);
  }

  @Patch(':orderId/:productId')
  @Permissions('update:order-items')
  update(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: UpdateOrderItemDto,
  ): Promise<OrderItemResponseDto> {
    return this.orderItemsService.update(orderId, productId, dto);
  }

  @Delete(':orderId/:productId')
  @Permissions('delete:order-items')
  remove(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<void> {
    return this.orderItemsService.remove(orderId, productId);
  }
}
