import { ProductSize } from 'src/product-sizes/entities/product-size.entity';
import { ProductStatus } from '../entities/product.entity';

export class ProductResponseDto {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId?: number;
  image: string;
  quantity: number;
  product_sizes?: ProductSize[];
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
}
