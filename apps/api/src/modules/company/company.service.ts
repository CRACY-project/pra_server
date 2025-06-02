import { Company, CompanyType, Prisma, User } from '@cracy/database';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { CreateCompanyDto, UpdateCompanyDto } from '@/modules/company/types/company.dto';
import { PrismaService } from '@/modules/prisma/prisma.service';

@Injectable()
export class CompanyService {
    private readonly logger = new Logger(CompanyService.name);
    constructor(private readonly prisma: PrismaService) {}

    async getById({ id }: { id: number }) {
        return await this.prisma.company.findUnique({
            where: {
                id,
            },
        });
    }

    async getByName({ name }: { name: string }) {
        return await this.prisma.company.findFirst({
            where: {
                name,
            },
        });
    }

    async getCustomers({
        params,
        search,
    }: {
        params?: {
            skip?: number;
            take?: number;
            orderBy?: Prisma.CompanyOrderByWithRelationInput;
        };
        search?: string;
    }) {
        const where: Prisma.CompanyWhereInput = {};
        if (search) {
            where.name = {
                contains: search,
            };
        }
        where.companyType = CompanyType.CUSTOMER;

        const companies = await this.prisma.company.findMany({
            where: where,
            orderBy: params?.orderBy
                ? params.orderBy
                : {
                      id: 'desc',
                  },
        });

        return {
            data: companies,
            size: companies.length,
        };
    }

    async createCustomer({ data }: { data: CreateCompanyDto; actor: User }): Promise<Company> {
        if (data.companyType && data.companyType !== CompanyType.CUSTOMER) {
            throw new BadRequestException(`Cannot create a customer of type ${data.companyType}`);
        }
        const company = await this.getByName({ name: data.name });

        if (company) throw new BadRequestException(`A company with name '${data.name}' already exists`);

        this.validate(data, company);

        const createdCompany = await this.prisma.company.create({
            data: {
                name: data.name,
                displayName: data.displayName,
                companyType: CompanyType.CUSTOMER,
            },
        });

        return createdCompany;
    }

    async updateCompany({ name, data }: { name: string; data: UpdateCompanyDto; actor: User }): Promise<Company> {
        const updateData: UpdateCompanyDto = {
            displayName: data.displayName,
            websiteUrl: data.websiteUrl,
            parentId: data.parentId,
            guidelinesAccepted: data.guidelinesAccepted,
            primaryContactEmail: data.primaryContactEmail,
        };

        if (data.nativeDevicesEnabled !== undefined) {
            updateData.nativeDevicesEnabled = data.nativeDevicesEnabled;
        }

        if (data.deviceLimitEnabled !== undefined) {
            updateData.deviceLimitEnabled = data.deviceLimitEnabled;
        }

        const updateCompany = await this.prisma.company.update({
            where: {
                name,
            },
            data: {
                ...updateData,
            },
        });

        return updateCompany;
    }

    async deleteCompany({ name }: { name: string; actor: User }): Promise<Company> {
        const company = await this.getByName({ name });
        if (!company) throw new NotFoundException(`No company found with name '${name}'`);

        const deletedCompany = await this.prisma.company.delete({
            where: {
                name,
            },
        });

        return deletedCompany;
    }

    validate(data: CreateCompanyDto, company: Company | null) {
        if (data instanceof CreateCompanyDto) {
            if (company) throw new BadRequestException(`A company with name ${data.name} already exists`);
        }
    }
}
