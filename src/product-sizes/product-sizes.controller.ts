import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CreateProductSizeDto } from './dto/create-product-size.dto';
import { UpdateProductSizeDto } from './dto/update-product-size.dto';
import { ProductSizesService } from 'src/product-sizes/product-sizes.service';

@Controller('product-sizes')
export class ProductSizesController {
  constructor(private readonly productSizesService: ProductSizesService) {}

  @Post()
  create(@Body() dto: CreateProductSizeDto) {
    return this.productSizesService.create(dto);
  }

  @Get()
  findAll() {
    return this.productSizesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productSizesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductSizeDto) {
    return this.productSizesService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productSizesService.remove(+id);
  }
}
