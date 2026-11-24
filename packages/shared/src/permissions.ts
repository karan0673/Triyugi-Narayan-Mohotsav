export const PERMISSION_FLAGS = [
  'viewBudget',
  'editBudget',
  'viewGuests',
  'editGuests',
  'sendInvites',
  'manageTasks',
  'manageEvents',
  'uploadMedia',
  'manageMedia',
  'viewShagun',
  'manageVendors',
] as const;

export type PermissionFlag = (typeof PERMISSION_FLAGS)[number];
export type Permissions = Partial<Record<PermissionFlag, boolean>>;

export function hasPermission(
  user: { role: string; permissions?: Permissions },
  flag: PermissionFlag,
): boolean {
  if (user.role === 'admin') return true;
  return user.permissions?.[flag] === true;
}
