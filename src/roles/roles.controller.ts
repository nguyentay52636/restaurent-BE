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
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AddPermissionsToRoleDto } from 'src/roles/dto/add-permissions-to-role.dto';
import { RoleResponseDto } from 'src/roles/dto/role-response.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.create(createRoleDto);
  }

  @Post(':roleId/permissions')
  async addPermissionsToRole(
    @Param('roleId') roleId: number,
    @Query('replace') replace: string,
    @Body() dto: AddPermissionsToRoleDto,
  ): Promise<RoleResponseDto> {
    const shouldReplace = replace === 'true';
    return this.rolesService.addPermissionsToRole(roleId, dto, shouldReplace);
  }

  @Get()
  async findAll() {
    return await this.rolesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.rolesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return await this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.rolesService.remove(id);
    return {
      message: `Role with ID ${id} has been deleted (or reassigned).`,
    };
  }
}
