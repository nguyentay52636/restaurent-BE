import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { join } from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PermissionsGuard } from 'src/permissions/permissions.guard';
import { Permissions } from 'src/permissions/decorator/permissions.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('create:products')
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, join(process.cwd(), 'public', 'uploads'));
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + '-' + file.originalname);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 50, //50MB
      },
      fileFilter(req, file, cb) {
        // /^.*\.(jpg|jpeg|png|gif|bmp|webp)$/i
        if (!file.mimetype.match('image/*')) {
          console.log('Cancel upload, file not support');
          // Block image upload in public/img folder
          cb(null, false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  create(
    @Body() dto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProductResponseDto> {
    if (file) {
      dto.image = file.path;
    }
    return this.productsService.create(dto, file);
  }

  @Get()
  findAll(): Promise<ProductResponseDto[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto> {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('update:products')
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, join(process.cwd(), 'uploads'));
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + '-' + file.originalname);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 50, //50MB
      },
      fileFilter(req, file, cb) {
        // /^.*\.(jpg|jpeg|png|gif|bmp|webp)$/i
        if (!file.mimetype.match('image/*')) {
          console.log('Cancel upload, file not support');
          // Block image upload in public/img folder
          cb(null, false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProductResponseDto> {
    if (file) {
      dto.image = file.path;
    }
    return this.productsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('delete:products')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productsService.remove(id);
  }
}
