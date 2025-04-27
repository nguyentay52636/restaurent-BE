import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

export enum RewardUsageStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('reward_usages')
export class RewardUsage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.rewardUsages)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'used_points', type: 'int' })
  usedPoints: number;

  @Column({ name: 'discount_percent', type: 'int' })
  discountPercent: number;

  @Column({ name: 'max_discount_amount', type: 'decimal' })
  maxDiscountAmount: number;

  @Column({
    type: 'enum',
    enum: RewardUsageStatus,
    default: RewardUsageStatus.PENDING,
    comment: 'pending | approved | rejected',
  })
  status: RewardUsageStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
