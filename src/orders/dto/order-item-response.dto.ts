import { ProductStatus } from 'src/products/entities/product.entity';
import { ProductSize } from 'src/product-sizes/entities/product-size.entity';

export class ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId?: number;
  image: string;
  product_sizes: ProductSize[];
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class OrderItemResponseDto {
  id: number;
  productId: number;
  product: ProductDto;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
