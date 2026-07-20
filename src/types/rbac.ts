export type PermissionValue = boolean | 'own';

export type Permissions = {
    [role: string]: {
        [resource: string]: {
            [action: string]: PermissionValue;
        };
    };
};
