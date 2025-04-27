import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}
