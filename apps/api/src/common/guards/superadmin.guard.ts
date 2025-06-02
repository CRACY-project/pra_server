import { PlatformUserRoleValue } from '@cracy/database';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { UserInRequest } from '../types/request-with-user.interface';

@Injectable()
export class SuperAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request & { user: UserInRequest }>();
        const user: UserInRequest = request.user;
        return user.platformRole === PlatformUserRoleValue.SUPERADMIN;
    }
}
