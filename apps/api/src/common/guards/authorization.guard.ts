import { Company, PlatformUserRoleValue, User, UserCompanyRoleValue } from '@cracy/database';
import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { ALLOW_SELF_KEY, COMPANY_PLATFORM_ROLES_KEY, COMPANY_ROLES_KEY, CompanyPlatformRole } from '@/decorators';
import { PLATFORM_ROLES_KEY } from '@/decorators/platform.roles.decorator';
import { PrismaService } from '@/modules/prisma/prisma.service';

import { UserInRequest } from '../types/request-with-user.interface';

type CompanyAuthArguments = {
    userId: number;
    companyId: number;
    allowedCompanyRoles: UserCompanyRoleValue[];
};

export type PlatformAuthArguments = {
    userId: number;
    partnerAllowed: boolean;
    distributorAllowed: boolean;
};

@Injectable()
export class UserAuthorizationGuard implements CanActivate {
    private readonly logger = new Logger(UserAuthorizationGuard.name);
    constructor(
        @Inject(PrismaService) private prisma: PrismaService,
        private reflector: Reflector
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request & { user: UserInRequest }>();
        const user: UserInRequest = request.user;
        if (user.platformRole === PlatformUserRoleValue.SUPERADMIN) {
            return true;
        }

        {
            // Platform role check
            const allowedPlatformRoles = this.reflector.getAllAndOverride<PlatformUserRoleValue[]>(PLATFORM_ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);

            if (allowedPlatformRoles && allowedPlatformRoles.includes(user.platformRole)) {
                return true;
            }
        }

        const company = await this.prisma.company.findUnique({
            where: { name: request.params.companyName },
        });
        if (!company) {
            throw new ForbiddenException('Forbidden resource');
        }
        {
            // Allow Self check
            const allowSelf = this.reflector.getAllAndOverride<boolean>(ALLOW_SELF_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);
            if (
                allowSelf &&
                user.company.name.toLowerCase() === request.params.companyName.toLowerCase() &&
                user.id === Number(request.params.userId)
            ) {
                return true;
            }
        }

        {
            // CompanyUserRole role check
            const allowedCompanyRoles = this.reflector.getAllAndOverride<UserCompanyRoleValue[]>(COMPANY_ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);
            if (allowedCompanyRoles && allowedCompanyRoles.length > 0) {
                const allowed = await this.getPermissionForCompany({
                    args: {
                        userId: user.id,
                        companyId: company.id,
                        allowedCompanyRoles,
                    },
                });
                if (allowed) return true;
            }
        }

        {
            // CompanyPlatformRole role check
            const allowedCompanyPlatformRoles = this.reflector.getAllAndOverride<CompanyPlatformRole[]>(
                COMPANY_PLATFORM_ROLES_KEY,
                [context.getHandler(), context.getClass()]
            );
            if (allowedCompanyPlatformRoles && allowedCompanyPlatformRoles.length > 0) {
                const allowed = await this.getPermissionForCompanyPlatformRole({
                    user,
                    company,
                    allowedCompanyPlatformRoles,
                });
                if (allowed) return true;
            }
        }

        return false;
    }

    async getPermissionForCompany({ args }: { args: CompanyAuthArguments }): Promise<boolean> {
        try {
            const requiredRolesCount = await this.prisma.userRole.count({
                where: {
                    AND: {
                        companyId: args.companyId,
                        OR: args.allowedCompanyRoles.map(role => ({ value: role })),
                        userId: args.userId,
                    },
                },
            });
            return requiredRolesCount > 0;
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }

    async getPermissionForCompanyPlatformRole({
        user,
        company,
        allowedCompanyPlatformRoles,
    }: {
        user: User;
        company: Company;
        allowedCompanyPlatformRoles: CompanyPlatformRole[];
    }): Promise<boolean> {
        for (const role of allowedCompanyPlatformRoles) {
            if (user.platformRole !== role.platformRole) continue;
            const roles = await this.prisma.userRole.count({
                where: {
                    userId: user.id,
                    companyId: company.id,
                    value: role.companyRole as UserCompanyRoleValue,
                },
            });
            if (roles >= 1) {
                return true;
            }
        }
        return false;
    }
}
