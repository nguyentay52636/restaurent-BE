import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RolesService } from './roles/roles.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly rolesService: RolesService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('roles-test')
  async getRolesTest() {
    try {
      const roles = await this.rolesService.findAll();
      return {
        message: 'Roles retrieved successfully',
        count: roles.length,
        roles: roles,
      };
    } catch (error) {
      return {
        message: 'Error retrieving roles',
        error: error.message,
        stack: error.stack,
      };
    }
  }
}
