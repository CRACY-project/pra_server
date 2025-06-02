import { User, UserRole } from '@cracy/database';
// Can not use GetPayload with optional relations
// BUG: https://github.com/prisma/prisma/issues/20550

export type UserWithRelations = User & {
    userRoles?: UserRole[];
};
