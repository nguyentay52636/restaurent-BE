import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AddPermissionsToRoleDto } from './dto/add-permissions-to-role.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PermissionsGuard } from 'src/permissions/permissions.guard';
import { Permissions } from 'src/permissions/decorator/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Permissions('create:roles')
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Post(':roleId/permissions')
  @Permissions('update:roles-permissions')
  async addPermissionsToRole(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Query('replace') replace: string,
    @Body() dto: AddPermissionsToRoleDto,
  ): Promise<RoleResponseDto> {
    const shouldReplace = replace === 'true';
    return this.rolesService.addPermissionsToRole(roleId, dto, shouldReplace);
  }

  @Get()
  @Permissions('read:roles')
  async findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Permissions('read:roles')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @Permissions('update:roles')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Permissions('delete:roles')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.rolesService.remove(id);
    return {
      message: `Role with ID ${id} has been deleted (or reassigned).`,
    };
  }
}
