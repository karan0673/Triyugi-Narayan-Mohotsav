import { type CanActivate, type ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type PermissionFlag, type Role, hasPermission } from '@triyugi/shared';
import { PERMISSIONS_KEY, ROLES_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const targets = [context.getHandler(), context.getClass()];
    const roles = this.reflector.getAllAndOverride<Role[] | undefined>(ROLES_KEY, targets);
    const flags = this.reflector.getAllAndOverride<PermissionFlag[] | undefined>(PERMISSIONS_KEY, targets);
    if (!roles && !flags) return true;

    const user = context.switchToHttp().getRequest().user;
    if (!user) throw new ForbiddenException({ code: 'FORBIDDEN' });

    if (roles && !roles.includes(user.role)) throw new ForbiddenException({ code: 'FORBIDDEN' });
    if (flags && !flags.every((f) => hasPermission(user, f))) {
      throw new ForbiddenException({ code: 'FORBIDDEN' });
    }
    return true;
  }
}
