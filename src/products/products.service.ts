import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  private toResponseDto(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      categoryId: product.category ? product.category.id : null,
      image: product.image,
      product_sizes: product.sizes ?? [],
      status: product.status,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    const category = dto.categoryId
      ? await this.categoryRepository.findOne({ where: { id: dto.categoryId } })
      : null;

    if (dto.categoryId && !category)
      throw new NotFoundException('Category not found');

    const product = this.productRepository.create({
      ...dto,
      category,
    });

    const saved = await this.productRepository.save(product);
    const fullProduct = await this.productRepository.findOne({
      where: { id: saved.id },
      relations: ['category', 'sizes'],
    });

    return this.toResponseDto(fullProduct);
  }

  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.find({
      relations: ['category', 'sizes'],
    });
    return products.map((product) => this.toResponseDto(product));
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'sizes'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return this.toResponseDto(product);
  }

  async update(id: number, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'sizes'],
    });
    if (!product) throw new NotFoundException('Product not found');

    const updated = this.productRepository.merge(product, dto);
    const saved = await this.productRepository.save(updated);

    const fullProduct = await this.productRepository.findOne({
      where: { id: saved.id },
      relations: ['category', 'sizes'],
    });

    return this.toResponseDto(fullProduct);
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    await this.productRepository.remove(product);
  }
}
