import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { RewardUsageStatus } from '../entities/reward-usage.entity';

export class CreateRewardUsageDto {
  @IsInt()
  userId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  usedPoints: number;

  @IsInt()
  discountPercent: number;

  @IsNumber()
  maxDiscountAmount: number;

  @IsEnum(RewardUsageStatus)
  @IsOptional()
  status?: RewardUsageStatus;
}
