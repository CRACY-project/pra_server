import { PlatformUserRoleValue, UserCompanyRoleValue } from '@cracy/typescript-client';

export const userPlatformRoleField = {
    label: 'Platform Role',
    type: 'select',
    name: 'platformRole',
    value: null,
    validation: 'required',
};

export const userEmailField = { label: 'Email', type: 'email', name: 'email', validation: 'required', value: null };

export interface CrudFormUser {
    email: string;
    roles: (PlatformUserRoleValue | UserCompanyRoleValue)[];
    COMPANYADMIN: boolean;
}
