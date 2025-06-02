import { UserCompanyRoleValue } from '@cracy/database';

export const UserPermissions = {
    READ: [UserCompanyRoleValue.COMPANYADMIN],
    CREATE: [UserCompanyRoleValue.COMPANYADMIN],
    UPDATE: [UserCompanyRoleValue.COMPANYADMIN],
    DELETE: [UserCompanyRoleValue.COMPANYADMIN],
};
