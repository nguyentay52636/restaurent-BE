import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AddPermissionsToRoleDto } from 'src/roles/dto/add-permissions-to-role.dto';
import { PermissionsService } from 'src/permissions/permissions.service';
import { RoleResponseDto } from './dto/role-response.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly permissionService: PermissionsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  private toResponseDto(role: Role): RoleResponseDto {
    return {
      id: role.id,
      name: role.name,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      permissions: role.permissions ?? [],
    };
  }

  async create(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    const role = this.roleRepository.create(createRoleDto);
    const savedRole = await this.roleRepository.save(role);
    return this.toResponseDto(savedRole);
  }

  async findAll(): Promise<RoleResponseDto[]> {
    const roles = await this.roleRepository.find({
      relations: ['permissions'],
    });
    return roles.map((role) => this.toResponseDto(role));
  }

  async findOne(id: number): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return this.toResponseDto(role);
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    Object.assign(role, updateRoleDto);
    const updatedRole = await this.roleRepository.save(role);
    return this.toResponseDto(updatedRole);
  }

  async remove(id: number): Promise<void> {
    if (id === 2) {
      throw new BadRequestException('Không thể xóa vai trò mặc định');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const roleToRemove = await queryRunner.manager.findOne(Role, {
        where: { id },
        relations: ['permissions'],
      });
      if (!roleToRemove)
        throw new NotFoundException(`Role với ID ${id} không tồn tại`);

      const defaultRole = await queryRunner.manager.findOne(Role, {
        where: { name: 'Người dùng' },
      });
      if (!defaultRole)
        throw new NotFoundException('Role mặc định "Người dùng" không tồn tại');

      await queryRunner.manager
        .createQueryBuilder()
        .update(User)
        .set({ role: defaultRole })
        .where('role_id = :id', { id })
        .execute();

      if (roleToRemove.permissions.length > 0) {
        await queryRunner.manager
          .createQueryBuilder()
          .relation(Role, 'permissions')
          .of(id)
          .remove(roleToRemove.permissions.map((p) => p.id));
      }

      await queryRunner.manager.remove(Role, roleToRemove);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Lỗi khi xóa role:', error);
      throw new InternalServerErrorException('Không thể xóa vai trò');
    } finally {
      await queryRunner.release();
    }
  }

  async addPermissionsToRole(
    roleId: number,
    dto: AddPermissionsToRoleDto,
    replace: boolean = false,
  ): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const permissions = await this.permissionService.findByIds(
      dto.permissionIds,
    );

    if (permissions.length !== dto.permissionIds.length) {
      throw new BadRequestException('Một hoặc nhiều permission không tồn tại');
    }

    if (replace) {
      role.permissions = permissions;
    } else {
      const existingPermissionIds = new Set(role.permissions.map((p) => p.id));
      const newPermissions = permissions.filter(
        (p) => !existingPermissionIds.has(p.id),
      );
      role.permissions = [...role.permissions, ...newPermissions];
    }

    const updatedRole = await this.roleRepository.save(role);
    return this.toResponseDto(updatedRole);
  }
}
