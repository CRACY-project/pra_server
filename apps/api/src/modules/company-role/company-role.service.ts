import { Prisma, UserCompanyRoleValue as UserCompanyRoleValuePrisma } from '@cracy/database';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { GetRolesRequest } from './types/company-role.dto';

@Injectable()
export class CompanyRoleService {
    constructor(private readonly prisma: PrismaService) {}

    async getRolesForUserByCompany({ userId, companyName }: { userId: number; companyName: string }) {
        return this.getRolesForCompany({ companyName, params: { userId } });
    }

    async getRolesForCompany({ companyName, params }: GetRolesRequest) {
        const where: Prisma.UserRoleWhereInput = {
            company: {
                name: companyName,
            },
        };
        if (params.values) {
            where.value = {
                in: params.values as UserCompanyRoleValuePrisma[],
            };
        }
        if (params.userId) {
            where.userId = +params.userId;
        }
        const queryBody: Prisma.UserRoleFindManyArgs = {
            orderBy: params.orderBy,
            where,
        };

        if (params.fields) {
            queryBody.select = params.fields.reduce((obj, field) => ({ ...obj, [field]: true }), {});
        } else {
            queryBody.include = {
                user: {
                    select: {
                        email: true,
                        companyId: true,
                        id: true,
                        userRoles: {
                            where: {
                                company: {
                                    name: companyName,
                                },
                            },
                        },
                    },
                },
            };
        }

        return this.prisma.userRole.findMany(queryBody);
    }

    async deleteCompanyRole({ id, companyName }: { id: number; companyName: string }) {
        return await this.prisma.userRole.delete({
            where: {
                id,
                company: {
                    name: companyName,
                },
            },
            include: {
                user: {
                    select: {
                        email: true,
                    },
                },
            },
        });
    }
}
