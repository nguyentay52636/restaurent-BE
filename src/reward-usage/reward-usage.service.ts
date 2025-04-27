import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RewardUsage } from './entities/reward-usage.entity';
import { CreateRewardUsageDto } from './dto/create-reward-usage.dto';
import { UpdateRewardUsageDto } from './dto/update-reward-usage.dto';
import { User } from 'src/users/entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class RewardUsagesService {
  constructor(
    @InjectRepository(RewardUsage)
    private rewardUsageRepo: Repository<RewardUsage>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateRewardUsageDto): Promise<RewardUsage> {
    const user = await this.userRepo.findOneBy({ id: dto.userId });
    if (!user) throw new NotFoundException('User not found');

    const usage = this.rewardUsageRepo.create({
      ...dto,
      user,
    });
    return await this.rewardUsageRepo.save(usage);
  }

  findAll(): Promise<RewardUsage[]> {
    return this.rewardUsageRepo.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<RewardUsage> {
    const usage = await this.rewardUsageRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!usage) throw new NotFoundException('Reward usage not found');
    return usage;
  }

  async update(id: number, dto: UpdateRewardUsageDto): Promise<RewardUsage> {
    const usage = await this.findOne(id);
    Object.assign(usage, dto);
    return this.rewardUsageRepo.save(usage);
  }

  async remove(id: number): Promise<void> {
    const usage = await this.findOne(id);
    await this.rewardUsageRepo.remove(usage);
  }
}
