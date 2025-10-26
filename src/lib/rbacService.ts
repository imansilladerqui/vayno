import { AuthService } from "./authService";
import { USER_ROLES } from "./constants";

// Simplified role-based access control for 3 roles
export class RBACService {
  private static readonly ROLE_PERMISSIONS = {
    [USER_ROLES.CUSTOMER]: ["view_own_data"],
    [USER_ROLES.ADMIN]: [
      "manage_parking",
      "manage_users",
      "view_all_data",
      "view_reports",
    ],
    [USER_ROLES.SUPERADMIN]: [
      "manage_parking",
      "manage_users",
      "view_all_data",
      "view_reports",
      "manage_settings",
      "export_data",
    ],
  };

  // Check if user has specific permission
  static async hasPermission(
    userId: string,
    permission: string
  ): Promise<boolean> {
    try {
      const userRole = await AuthService.getUserRole(userId);
      if (!userRole) return false;

      const permissions =
        this.ROLE_PERMISSIONS[userRole as keyof typeof this.ROLE_PERMISSIONS] ||
        [];
      return permissions.includes(permission);
    } catch {
      return false;
    }
  }

  // Check multiple permissions (user needs ALL permissions)
  static async hasAllPermissions(
    userId: string,
    permissions: string[]
  ): Promise<boolean> {
    try {
      for (const permission of permissions) {
        if (!(await this.hasPermission(userId, permission))) {
          return false;
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  // Check multiple permissions (user needs ANY permission)
  static async hasAnyPermission(
    userId: string,
    permissions: string[]
  ): Promise<boolean> {
    try {
      for (const permission of permissions) {
        if (await this.hasPermission(userId, permission)) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  // Simplified role checks
  static getRoleLevel(role: string): number {
    const roleLevels = {
      [USER_ROLES.CUSTOMER]: 1,
      [USER_ROLES.ADMIN]: 2,
      [USER_ROLES.SUPERADMIN]: 3,
    };
    return roleLevels[role as keyof typeof roleLevels] || 0;
  }

  static async canAccessResource(
    userId: string,
    resourceUserId: string,
    _permission: string
  ): Promise<boolean> {
    try {
      const userRole = await AuthService.getUserRole(userId);

      if (userRole === USER_ROLES.SUPERADMIN || userRole === USER_ROLES.ADMIN) {
        return true;
      }

      return userId === resourceUserId;
    } catch {
      return false;
    }
  }

  static async filterDataByPermissions<T extends { user_id?: string }>(
    userId: string,
    data: T[],
    permission: string
  ): Promise<T[]> {
    try {
      const hasGlobalPermission = await this.hasPermission(userId, permission);
      if (hasGlobalPermission) {
        return data;
      }
      return data.filter((item) => item.user_id === userId);
    } catch {
      return [];
    }
  }

  static async validateAction(
    userId: string,
    action: string,
    _resourceId: string | undefined,
    resourceUserId?: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    try {
      const hasPermission = await this.hasPermission(userId, action);
      if (!hasPermission) {
        return {
          allowed: false,
          reason: `User does not have permission: ${action}`,
        };
      }

      if (resourceUserId && resourceUserId !== userId) {
        const canAccess = await this.canAccessResource(
          userId,
          resourceUserId,
          action
        );
        if (!canAccess) {
          return {
            allowed: false,
            reason: "User cannot access this resource",
          };
        }
      }

      return { allowed: true };
    } catch {
      return {
        allowed: false,
        reason: "Validation error occurred",
      };
    }
  }

  // Get user's accessible features
  static async getUserFeatures(userId: string): Promise<string[]> {
    try {
      const userRole = await AuthService.getUserRole(userId);
      if (!userRole) return [];

      return (
        this.ROLE_PERMISSIONS[userRole as keyof typeof this.ROLE_PERMISSIONS] ||
        []
      );
    } catch {
      return [];
    }
  }

  static async canManageParking(userId: string): Promise<boolean> {
    const userRole = await AuthService.getUserRole(userId);
    return userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPERADMIN;
  }

  static async canViewReports(userId: string): Promise<boolean> {
    const userRole = await AuthService.getUserRole(userId);
    return userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPERADMIN;
  }

  static async isSuperAdmin(userId: string): Promise<boolean> {
    try {
      const userRole = await AuthService.getUserRole(userId);
      return userRole === USER_ROLES.SUPERADMIN;
    } catch {
      return false;
    }
  }

  static async isSuperAdminLevel(userId: string): Promise<boolean> {
    const userRole = await AuthService.getUserRole(userId);
    return userRole === USER_ROLES.SUPERADMIN;
  }

  static async canManageUsers(userId: string): Promise<boolean> {
    const userRole = await AuthService.getUserRole(userId);
    return userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPERADMIN;
  }
}
