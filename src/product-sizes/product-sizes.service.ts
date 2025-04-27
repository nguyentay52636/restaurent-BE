import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSize } from './entities/product-size.entity';
import { CreateProductSizeDto } from './dto/create-product-size.dto';
import { UpdateProductSizeDto } from './dto/update-product-size.dto';

@Injectable()
export class ProductSizesService {
  constructor(
    @InjectRepository(ProductSize)
    private readonly productSizeRepository: Repository<ProductSize>,
  ) {}

  async create(dto: CreateProductSizeDto) {
    const productSize = this.productSizeRepository.create({
      ...dto,
      product: { id: dto.productId },
    });
    return this.productSizeRepository.save(productSize);
  }

  async findAll() {
    return this.productSizeRepository.find({ relations: ['product'] });
  }

  async findOne(id: number) {
    const item = await this.productSizeRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!item) throw new NotFoundException('Product size not found');
    return item;
  }

  async update(id: number, dto: UpdateProductSizeDto) {
    const existing = await this.findOne(id);
    const updated = Object.assign(existing, {
      ...dto,
      ...(dto.productId && { product: { id: dto.productId } }),
    });
    return this.productSizeRepository.save(updated);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    return this.productSizeRepository.remove(item);
  }
}
