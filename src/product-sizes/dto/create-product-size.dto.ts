import { IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { DrinkSize } from '../entities/product-size.entity';

export class CreateProductSizeDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsEnum(DrinkSize)
  size: DrinkSize;

  @IsNumber()
  @IsPositive()
  price: number;
}
