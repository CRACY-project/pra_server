import { UserCompanyRoleValue } from '@cracy/database';

export const CompanyPermissions = {
    READ: [UserCompanyRoleValue.COMPANYADMIN],
    CREATE: [],
    UPDATE: [UserCompanyRoleValue.COMPANYADMIN],
    DELETE: [],
};
