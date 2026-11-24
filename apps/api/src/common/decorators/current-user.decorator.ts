import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Permissions, Role } from '@triyugi/shared';

export interface AuthUser {
  id: string;
  role: Role;
  permissions: Permissions;
}

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthUser => {
  return ctx.switchToHttp().getRequest().user;
});
