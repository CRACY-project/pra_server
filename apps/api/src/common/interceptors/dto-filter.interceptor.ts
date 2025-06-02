import { PlatformUserRoleValue } from '@cracy/database';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RequestWithUser } from '@/common/types';
import { sanitizeCompanyData } from '@/utils/sanitize-company-data';
import { getUserCompanyRole } from '@/utils/user-company-role';

export interface Response<T> {
    statusCode: number;
    data: T;
}

type ApiResponse<T> = Record<string, { type: ClassConstructor<Response<T>> }>;

@Injectable()
export class DtoFilterInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Observable<Response<T>> | Promise<Observable<Response<T>>> {
        const handler = context.getHandler();
        const request = context.switchToHttp().getRequest<RequestWithUser>();
        const userRoles = request.user?.userRoles ?? [];
        const userPlatformRole = request.user?.platformRole;
        const roles = getUserCompanyRole(userRoles, request.params.company);
        const responses = Reflect.getMetadata('swagger/apiResponse', handler) as ApiResponse<T>;

        return next.handle().pipe(
            map((data: Response<T>) => {
                if (!userPlatformRole && !userRoles.length) return data;
                if (userPlatformRole === PlatformUserRoleValue.SUPERADMIN) return data;
                if (responses['200']) {
                    data = plainToInstance(responses['200'].type, data, {
                        groups: roles,
                    });
                    sanitizeCompanyData(data, userRoles);
                }
                if (responses['201']) {
                    data = plainToInstance(responses['201'].type, data, {
                        groups: roles,
                    });
                    sanitizeCompanyData(data, userRoles);
                }

                return data;
            })
        );
    }
}
