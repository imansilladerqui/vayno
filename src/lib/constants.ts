// User Role Constants
export const USER_ROLES = {
  CUSTOMER: "customer",
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
} as const;

export type UserRoleType = (typeof USER_ROLES)[keyof typeof USER_ROLES];
