import { Product } from 'src/products/entities/product.entity';

export class OrderItemResponseDto {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
