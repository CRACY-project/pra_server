import { UserCompanyRoleValue } from '@cracy/database';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserCompanyRoleValue[]) => SetMetadata(ROLES_KEY, roles);
