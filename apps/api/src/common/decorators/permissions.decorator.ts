import { SetMetadata } from '@nestjs/common';
import type { PermissionFlag, Role } from '@triyugi/shared';

export const PERMISSIONS_KEY = 'permissions';
export const ROLES_KEY = 'roles';

/** Requires every listed permission flag (admin always passes). */
export const RequirePermissions = (...flags: PermissionFlag[]) => SetMetadata(PERMISSIONS_KEY, flags);

/** Restricts the route to these roles. */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
