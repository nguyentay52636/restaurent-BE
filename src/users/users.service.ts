import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly roleService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const userData = { ...createUserDto };

      // Set default points to 0 if not provided
      if (userData.points === undefined) {
        userData.points = 0;
      }

      // Handle roleId - attempt to verify the role exists
      if (userData.roleId) {
        try {
          await this.roleService.findOne(userData.roleId);
          this.logger.log(`Role with ID ${userData.roleId} found`);
        } catch (error) {
          this.logger.warn(
            `Role with ID ${userData.roleId} not found: ${error.message}`,
          );
          // If specified role doesn't exist, fallback to finding a default role
          const roles = await this.roleService.findAll();
          this.logger.log(
            `Available roles: ${roles.map((r) => `${r.id}:${r.name}`).join(', ')}`,
          );

          const userRole = roles.find(
            (item) => item.name === 'Người dùng' || item.name === 'user',
          );
          if (!userRole) {
            throw new Error(
              'Neither specified role nor default user role found',
            );
          }

          userData.roleId = userRole.id;
          this.logger.log(`Using default role with ID ${userData.roleId}`);
        }
      } else {
        // If roleId is not provided, use default role
        const roles = await this.roleService.findAll();
        this.logger.log(
          `Looking for default role among: ${roles.map((r) => `${r.id}:${r.name}`).join(', ')}`,
        );

        const userRole = roles.find(
          (item) => item.name === 'Người dùng' || item.name === 'user',
        );
        if (!userRole) {
          throw new Error('Default user role not found');
        }

        userData.roleId = userRole.id;
        this.logger.log(`Using default role with ID ${userData.roleId}`);
      }

      // Create and save the user
      this.logger.log(`Creating user with data: ${JSON.stringify(userData)}`);
      const user = this.userRepo.create(userData);
      this.logger.log(`User entity created: ${JSON.stringify(user)}`);

      const savedUser = await this.userRepo.save(user);
      this.logger.log(`User saved successfully with ID: ${savedUser.id}`);

      return savedUser;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw error;
    }
  }

  findAll() {
    return this.userRepo.find({});
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
