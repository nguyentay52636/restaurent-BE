import { PartialType } from '@nestjs/mapped-types';
import { CreateRewardUsageDto } from './create-reward-usage.dto';
import { IsOptional, IsInt, IsString, IsEnum, Min } from 'class-validator';
import { RewardUsageStatus } from 'src/reward-usage/entities/reward-usage.entity';

export class UpdateRewardUsageDto extends PartialType(CreateRewardUsageDto) {
  @IsOptional()
  @IsInt()
  user_id?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  used_points?: number;

  @IsOptional()
  @IsInt()
  discount_percent?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  max_discount_amount?: number;

  @IsOptional()
  @IsString()
  @IsEnum(RewardUsageStatus)
  status?: RewardUsageStatus;
}
