import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async create(dto: CreateReviewDto) {
    const existingReview = await this.reviewRepository.findOne({
      where: {
        order: { id: dto.orderId },
      },
    });

    if (existingReview) {
      throw new BadRequestException('Đơn hàng này đã được đánh giá');
    }

    const review = this.reviewRepository.create({
      rating: dto.rating,
      content: dto.content,
      user: { id: dto.userId },
      order: { id: dto.orderId },
    });

    return this.reviewRepository.save(review);
  }

  async findAll() {
    return this.reviewRepository.find({
      relations: ['user', 'order'],
    });
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'order'],
    });
    if (!review) throw new NotFoundException('Không tìm thấy đánh giá');
    return review;
  }

  async update(id: number, dto: UpdateReviewDto) {
    const review = await this.findOne(id);

    if (dto.userId) review.user = { id: dto.userId } as any;
    if (dto.orderId) review.order = { id: dto.orderId } as any;
    if (dto.rating !== undefined) review.rating = dto.rating;
    if (dto.content !== undefined) review.content = dto.content;

    return this.reviewRepository.save(review);
  }

  async remove(id: number) {
    const review = await this.findOne(id);
    return this.reviewRepository.remove(review);
  }
}
