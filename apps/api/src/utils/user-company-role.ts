import { UserRole } from '@/modules/company-role/types/company-role.dto';

export const getUserCompanyRole = (userRoles: UserRole[], companyName: string) => {
    const companyRoles = userRoles.filter(role => role?.company?.name === companyName);

    const mappedRoles = companyRoles.map(role => role.value);

    return mappedRoles;
};
