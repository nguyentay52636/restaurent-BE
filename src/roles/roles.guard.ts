// roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ROLES_KEY } from 'src/roles/decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: JwtPayload & { roleId?: number; role?: { name: string } } =
      request.user;

    const userRole = user.role?.name;
    if (!userRole || !requiredRoles.includes(userRole)) {
      throw new ForbiddenException('Access denied for your role');
    }

    return true;
  }
}
