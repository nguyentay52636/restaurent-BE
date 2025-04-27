import {
  IsInt,
  Min,
  Max,
  IsString,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  orderId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
