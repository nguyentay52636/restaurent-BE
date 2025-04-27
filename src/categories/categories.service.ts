import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  private toResponseDto(category: Category): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const newCategory = this.categoryRepo.create(dto);
    const saved = await this.categoryRepo.save(newCategory);
    return this.toResponseDto(saved);
  }

  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepo.find();
    return categories.map(this.toResponseDto);
  }

  async findOne(id: number): Promise<CategoryResponseDto> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return this.toResponseDto(category);
  }

  async update(
    id: number,
    dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    const updated = this.categoryRepo.merge(category, dto);
    const saved = await this.categoryRepo.save(updated);
    return this.toResponseDto(saved);
  }

  async remove(id: number): Promise<void> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    await this.categoryRepo.remove(category);
  }
}
