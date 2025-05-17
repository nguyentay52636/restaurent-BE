import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table } from './entities/table.entity';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private tableRepo: Repository<Table>,
  ) {}

  async create(dto: CreateTableDto) {
    const table = this.tableRepo.create(dto);
    console.log(dto);
    return this.tableRepo.save(table);
  }

  async findAll() {
    return this.tableRepo.find({
      relations: [
        'reservations',
        'reservations.user',
        'reservations.orders',
        'reservations.tables',
        'reservations.orders.payments',
        'reservations.orders.orderItems',
        'reservations.orders.orderItems.product',
      ],
    });
  }

  async findOne(id: number) {
    const table = await this.tableRepo.findOne({
      where: { id },
      relations: [
        'reservations',
        'reservations.user',
        'reservations.orders',
        'reservations.tables',
        'reservations.orders.payments',
        'reservations.orders.orderItems',
        'reservations.orders.orderItems.product',
      ],
    });
    if (!table) throw new NotFoundException('Table not found');
    return table;
  }

  async update(id: number, dto: UpdateTableDto) {
    const table = await this.findOne(id);
    Object.assign(table, dto);
    return this.tableRepo.save(table);
  }

  async remove(id: number) {
    const table = await this.findOne(id);
    return this.tableRepo.remove(table);
  }
}
