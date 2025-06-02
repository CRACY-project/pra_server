import { SetMetadata } from '@nestjs/common';

import { PlatformUserRoleValue } from '@/modules/user/types/user.dto';

export const PLATFORM_ROLES_KEY = 'platform_roles';
export const PlatformRoles = (...roles: PlatformUserRoleValue[]) => SetMetadata(PLATFORM_ROLES_KEY, roles);
