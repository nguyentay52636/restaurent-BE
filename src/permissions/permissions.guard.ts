import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from 'src/permissions/decorator/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    console.log(
      '📌 [PermissionsGuard] Required Permissions:',
      requiredPermissions,
    );
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('👤 [PermissionsGuard] User from request:', user);

    if (!user || !user.role.permissions) {
      throw new ForbiddenException('User does not have any permissions');
    }

    console.log(
      '🔐 [PermissionsGuard] User permissions:',
      user.role.permissions,
    );

    const userPermissions = user.role.permissions.map((p) => p.name);

    console.log('🔐 [PermissionsGuard] User permission name:', userPermissions);

    const hasPermission = requiredPermissions.every((perm) =>
      userPermissions.includes(perm),
    );

    console.log(
      '✅ [PermissionsGuard] Has all required permissions?',
      hasPermission,
    );

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
