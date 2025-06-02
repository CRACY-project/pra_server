import { PlatformUserRoleValue, UserCompanyRoleValue, type UserDto } from '@cracy/typescript-client';

import { userRoles } from './roles';

export function isPlatformUserRoleValue(x: any): x is PlatformUserRoleValue {
    return Object.values(PlatformUserRoleValue).includes(x);
}

export function getRolesStringForUser(user: UserDto) {
    return (
        user.userRoles
            ?.map(role => {
                if (role.value === UserCompanyRoleValue.COMPANYADMIN) {
                    return 'Admin';
                }
                return userRoles[role.value];
            })
            .slice(-1)
            .join(', ') || ''
    );
}
