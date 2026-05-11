// constants/roles.ts - User roles constants

export const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  MANAGER: 'manager',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.STAFF]: 'Staff Gudang',
  [USER_ROLES.MANAGER]: 'Manager',
} as const;