import { CompanyType } from '@cracy/database';
import { Injectable } from '@nestjs/common';

import { CreateCompanyDto } from '@/modules/company/types/company.dto';
import { PrismaService } from '@/modules/prisma/prisma.service';

import { ISeeder } from '../seeder';
import { companies } from './data';
@Injectable()
export class CompanySeederService implements ISeeder {
    constructor(private readonly prisma: PrismaService) {}

    async seed(): Promise<void> {
        await Promise.all(
            companies.map(async (company: CreateCompanyDto) => {
                await this.prisma.company.upsert({
                    where: { name: company.name },
                    update: {},
                    create: {
                        name: company.name,
                        displayName: company.displayName,
                        companyType: CompanyType.SUPERCOMPANY,
                    },
                });
            })
        );
    }
}
