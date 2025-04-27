import { Module } from '@nestjs/common';
import { RewardUsagesService } from './reward-usage.service';
import { RewardUsagesController } from './reward-usage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardUsage } from 'src/reward-usage/entities/reward-usage.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RewardUsage, User])],
  controllers: [RewardUsagesController],
  providers: [RewardUsagesService],
})
export class RewardUsageModule {}
