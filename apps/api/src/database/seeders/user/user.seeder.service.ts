import { AuthenticationType, PlatformUserRoleValue, UserCompanyRoleValue } from '@cracy/database';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/modules/prisma/prisma.service';

import { ISeeder } from '../seeder';
import { users } from './data';

@Injectable()
export class UserSeederService implements ISeeder {
    constructor(private readonly prisma: PrismaService) {}

    async seed(): Promise<void> {
        await Promise.all(
            users.map(async user => {
                console.log(`Seeding user ${user.email}`);
                const company = await this.prisma.company.findFirst({
                    where: {
                        name: user.company.connect.name,
                    },
                });
                if (!company) {
                    throw new Error(`Company ${user.company.connect.name} not found`);
                }
                await this.prisma.user.upsert({
                    where: {
                        email: user.email,
                    },
                    update: {},
                    create: {
                        ...user,
                        authenticationType: AuthenticationType.UNCLAIMED,
                        userRoles: {
                            create: {
                                value: UserCompanyRoleValue.COMPANYADMIN,
                                companyId: company.id,
                            },
                        },
                        platformRole: PlatformUserRoleValue.SUPERADMIN,
                    },
                });
            })
        );
    }
}
