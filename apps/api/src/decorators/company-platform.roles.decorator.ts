import { SetMetadata } from '@nestjs/common';

import { UserCompanyRoleValue } from '@/modules/company-role/types/company-role.dto';
import { PlatformUserRoleValue } from '@/modules/user/types/user.dto';

// This decorator grants access to a route based on both the user's platform role and company role, enabling specific functionalities.
// For instance, users within a company can retrieve a list of all users within that company, but only if their platform role is partner or distributor.

export interface CompanyPlatformRole {
    platformRole: PlatformUserRoleValue;
    companyRole: UserCompanyRoleValue;
}
export const COMPANY_PLATFORM_ROLES_KEY = 'company_platform_roles';
export const CompanyPlatformRoles = (roles: CompanyPlatformRole[]) => SetMetadata(COMPANY_PLATFORM_ROLES_KEY, roles);
