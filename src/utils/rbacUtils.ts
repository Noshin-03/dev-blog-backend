import { Role } from '@prisma/client';
import { Permissions } from '../types/rbac';
import permissionsData from '../config/permissions.json';

export class RBACUtils {
    private static permissions: Permissions = permissionsData as Permissions;

    static hasPermission(
        role: Role,
        resource: string,
        action: string,
        userId?: string,
        resourceOwnerId?: string,
    ): boolean {
        const rolePermissions = this.permissions[role];

        if (!rolePermissions) {
            return false;
        }

        const resourcePermissions = rolePermissions[resource];

        if (!resourcePermissions) {
            return false;
        }

        const permission = resourcePermissions[action];

        if (permission === undefined) {
            return false;
        }

        if (typeof permission === 'boolean') {
            return permission;
        }

        if (permission === 'own') {
            if (!userId || !resourceOwnerId) {
                return false;
            }
            return userId === resourceOwnerId;
        }

        return false;
    }
}
