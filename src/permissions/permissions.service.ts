import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionResponseDto } from './dto/permission-response.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
  ) {}

  async create(dto: CreatePermissionDto): Promise<PermissionResponseDto> {
    const permission = this.permissionRepo.create(dto);
    await this.permissionRepo.save(permission);
    return permission;
  }

  async findAll(): Promise<PermissionResponseDto[]> {
    return this.permissionRepo.find();
  }

  async findOne(id: number): Promise<PermissionResponseDto> {
    const permission = await this.permissionRepo.findOneBy({ id });
    if (!permission) throw new NotFoundException('Permission not found');
    return permission;
  }

  async update(
    id: number,
    dto: UpdatePermissionDto,
  ): Promise<PermissionResponseDto> {
    await this.permissionRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.permissionRepo.delete(id);
  }
}
