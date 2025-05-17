import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PermissionsGuard } from 'src/permissions/permissions.guard';
import { Permissions } from 'src/permissions/decorator/permissions.decorator';

@Controller('tables')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @Permissions('create:tables')
  create(@Body() dto: CreateTableDto) {
    return this.tablesService.create(dto);
  }

  @Get()
  @Permissions('read:tables')
  findAll() {
    return this.tablesService.findAll();
  }

  @Get(':id')
  @Permissions('read:tables')
  findOne(@Param('id') id: string) {
    return this.tablesService.findOne(+id);
  }

  @Put(':id')
  @Permissions('update:tables')
  update(@Param('id') id: string, @Body() dto: UpdateTableDto) {
    return this.tablesService.update(+id, dto);
  }

  @Delete(':id')
  @Permissions('delete:tables')
  remove(@Param('id') id: string) {
    return this.tablesService.remove(+id);
  }
}
