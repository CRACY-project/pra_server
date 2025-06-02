import { UserCompanyRoleValue } from '@cracy/database';

export const PDEPermissions = {
    CREATE: [UserCompanyRoleValue.COMPANYADMIN],
    READ: [UserCompanyRoleValue.COMPANYADMIN],
    UPDATE: [UserCompanyRoleValue.COMPANYADMIN],
    DELETE: [UserCompanyRoleValue.COMPANYADMIN],
};
