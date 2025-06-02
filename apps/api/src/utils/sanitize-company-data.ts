import { CompanyUserRoleDto } from '@/modules/company-role/types/company-role.dto';

export const sanitizeCompanyData = (data: any, userRoles: CompanyUserRoleDto[]) => {
    if (Array.isArray(data)) {
        for (const dataObj of data) {
            deleteIfCompanyExists(dataObj, userRoles);
        }
    } else {
        deleteIfCompanyExists(data, userRoles);
    }
};

const deleteIfCompanyExists = (data: any, userRoles: CompanyUserRoleDto[]) => {
    if (typeof data !== 'object' || data == undefined) return;

    for (const [key, value] of Object.entries(data)) {
        if (key === 'company') {
            const roleExists = userRoles.find(role => role.companyId === data.companyId);
            if (!roleExists) delete data.company;
        } else if (Array.isArray(value)) {
            for (const valueObj of value) {
                deleteIfCompanyExists(valueObj, userRoles);
            }
        } else if (typeof value === 'object') {
            deleteIfCompanyExists(value, userRoles);
        }
    }
};
