import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly roleService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const roles = await this.roleService.findAll();

    const userRole = roles.find((item) => item.name === 'user');
    if (!userRole) {
      throw new Error('Default role "user" not found');
    }

    const user = this.userRepo.create({
      ...createUserDto,
      roleId: userRole.id,
    });
    console.log('User created:', user);

    return this.userRepo.save(user);
  }

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepo.update(id, updateUserDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.userRepo.delete(id);
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }
}
