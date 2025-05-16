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
    if (!dto.orderId && !dto.productId) {
      throw new BadRequestException('Phải cung cấp orderId hoặc productId');
    }

    if (dto.orderId && dto.productId) {
      throw new BadRequestException('Không thể cung cấp cả orderId và productId');
    }

    if (dto.orderId) {
      const existingReview = await this.reviewRepository.findOne({
        where: {
          order: { id: dto.orderId },
        },
      });

      if (existingReview) {
        throw new BadRequestException('Đơn hàng này đã được đánh giá');
      }
    }

    const review = this.reviewRepository.create({
      rating: dto.rating,
      comment: dto.comment,
      user: { id: dto.userId },
      order: dto.orderId ? { id: dto.orderId } : null,
      product: dto.productId ? { id: dto.productId } : null,
    });

    const savedReview = await this.reviewRepository.save(review);
    
    // Fetch the complete review with all relations
    return this.reviewRepository.findOne({
      where: { id: savedReview.id },
      relations: ['user', 'order', 'product'],
    });
  }

  async findAll() {
    return this.reviewRepository.find({
      relations: ['user', 'order', 'product'],
    });
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'order', 'product'],
    });
    if (!review) throw new NotFoundException('Không tìm thấy đánh giá');
    return review;
  }

  async update(id: number, dto: UpdateReviewDto) {
    const review = await this.findOne(id);

    if (dto.userId) review.user = { id: dto.userId } as any;
    if (dto.orderId) review.order = { id: dto.orderId } as any;
    if (dto.productId) review.product = { id: dto.productId } as any;
    if (dto.rating !== undefined) review.rating = dto.rating;
    if (dto.comment !== undefined) review.comment = dto.comment;

    await this.reviewRepository.save(review);
    
    // Fetch the complete review with all relations after update
    return this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'order', 'product'],
    });
  }

  async remove(id: number) {
    const review = await this.findOne(id);
    return this.reviewRepository.remove(review);
  }
}
