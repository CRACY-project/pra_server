import { UserCompanyRoleValue } from '@cracy/database';
import { SetMetadata } from '@nestjs/common';

export const COMPANY_ROLES_KEY = 'roles';
export const CompanyRoles = (...roles: (UserCompanyRoleValue | UserCompanyRoleValue[])[]) => {
    const flatRoles = roles.flat();
    return SetMetadata(COMPANY_ROLES_KEY, flatRoles);
};

// When an endpoint is decorated with @AllowSelf, the user is allowed to access their own data (based on userId)
export const ALLOW_SELF_KEY = 'allow_self';
export const AllowSelf = () => SetMetadata(ALLOW_SELF_KEY, 1);
