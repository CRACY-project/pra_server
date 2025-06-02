import { UserCompanyRoleValue } from '@cracy/database';

export const TagPermissions = {
    READ: [UserCompanyRoleValue.COMPANYADMIN],
    CREATE: [UserCompanyRoleValue.COMPANYADMIN],
    UPDATE: [UserCompanyRoleValue.COMPANYADMIN],
    DELETE: [UserCompanyRoleValue.COMPANYADMIN],
};
