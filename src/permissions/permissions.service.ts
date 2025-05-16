import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionResponseDto } from './dto/permission-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
  ) {}

  async create(dto: CreatePermissionDto): Promise<PermissionResponseDto> {
    const permission = this.permissionRepo.create(dto);
    await this.permissionRepo.save(permission);
    return plainToInstance(PermissionResponseDto, permission);
  }

  async findAll(): Promise<PermissionResponseDto[]> {
    const permissions = await this.permissionRepo.find({
      relations: ['roles'],
    });
    return plainToInstance(PermissionResponseDto, permissions);
  }

  async findOne(id: number): Promise<PermissionResponseDto> {
    const permission = await this.permissionRepo.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!permission) throw new NotFoundException('Permission not found');
    return plainToInstance(PermissionResponseDto, permission);
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

  async findByIds(ids: number[]): Promise<Permission[]> {
    if (!ids || ids.length === 0) return [];
    return this.permissionRepo.findBy({ id: In(ids) });
  }
}
