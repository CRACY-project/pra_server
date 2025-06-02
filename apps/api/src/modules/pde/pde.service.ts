import { Prisma, User } from '@cracy/database';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { CreatePDEDto, PDEDto, UpdatePDEDto } from '@/modules/pde/types/pde.dto';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PDEService {
    private readonly logger = new Logger(PDEService.name);
    constructor(private readonly prisma: PrismaService) {}

    async getById({ id }: { id: number }) {
        return await this.prisma.pDE.findUnique({
            where: {
                id,
            },
        });
    }

    async getByIdAndCompany({ id, companyName }: { id: number; companyName: string }) {
        return this.prisma.pDE.findUnique({
            where: {
                id,
                company: {
                    name: companyName,
                },
            },
            include: {
                company: true,
            },
        });
    }

    async getByCompanyName({
        companyName,
        params,
        search,
    }: {
        companyName: string;
        params?: {
            skip?: number;
            take?: number;
            orderBy?: Prisma.PDEOrderByWithRelationInput;
        };
        search?: string;
    }) {
        const where: Prisma.PDEWhereInput = {};

        if (search) {
            where.name = {
                contains: search,
            };
        }
        where.OR = [
            {
                company: {
                    name: companyName,
                },
            },
        ];

        const result = await this.prisma.pDE.findMany({
            ...params,
            orderBy: params?.orderBy
                ? params.orderBy
                : {
                      id: 'desc',
                  },
            where,
        });

        const size = await this.prisma.pDE.count({
            where,
        });

        return { data: result, size };
    }

    async deleteByCompany({ id, companyName }: { id: number; companyName: string; actor: User }) {
        return this.prisma.pDE.delete({
            where: {
                id,
                company: {
                    name: companyName,
                },
            },
        });
    }

    async createForCompany({ data, companyName }: { data: CreatePDEDto; actor: User; companyName: string }) {
        return await this.prisma.pDE.create({
            data: {
                name: data.name,
                token: data.token,
                serialNumber: data.serialNumber,
                company: {
                    connect: {
                        name: companyName,
                    },
                },
                lastSeen: new Date(0), // Unix epoch - January 1, 1970
            },
        });
    }

    async updateByCompany({
        id,
        data,
        companyName,
    }: {
        id: number;
        data: UpdatePDEDto;
        companyName: string;
        actor: User;
    }): Promise<PDEDto> {
        const company = await this.prisma.company.findUnique({
            where: {
                name: companyName,
            },
        });
        if (!company) {
            throw new Error('Company not found');
        }

        const tagsData: Prisma.TagCreateManyInput[] =
            data.tags?.map(tag => ({
                companyId: company.id,
                name: tag,
            })) || [];

        return await this.prisma.$transaction(async tx => {
            const pde = await tx.pDE.update({
                where: {
                    id,
                    company: {
                        name: companyName,
                    },
                },
                data: {
                    name: data.name,
                    serialNumber: data.serialNumber,
                    tags: {
                        deleteMany: {},
                        createMany: {
                            data: tagsData,
                            skipDuplicates: true,
                        },
                    },
                },
            });
            // Delete all tags that are now unused
            await tx.tag.deleteMany({
                where: {
                    companyId: company.id,
                    pDEId: null,
                },
            });

            return pde;
        });
    }

    async createSystemInfo({ id, data }: { id: number; data: string }) {
        const pde = await this.getById({
            id,
        });

        if (!pde) {
            throw new NotFoundException('PDE not found');
        }

        return await this.prisma.systemInfo.create({
            data: {
                data,
                pde: {
                    connect: {
                        id,
                    },
                },
            },
        });
    }

    async createLibraryInfo({ id, data }: { id: number; data: string }) {
        const pde = await this.getById({
            id,
        });

        if (!pde) {
            throw new NotFoundException('PDE not found');
        }

        return await this.prisma.libraryInfo.create({
            data: {
                data,
                pde: {
                    connect: {
                        id,
                    },
                },
            },
        });
    }

    async getPDEInfo({ id, companyName }: { id: number; companyName: string }) {
        const pde = await this.getByIdAndCompany({
            id,
            companyName,
        });

        if (!pde) {
            throw new NotFoundException('PDE not found');
        }

        const systemInfo = await this.prisma.systemInfo.findMany({
            where: {
                pdeId: id,
            },
            orderBy: {
                timestamp: 'desc',
            },
            take: 1,
        });

        const libraryInfo = await this.prisma.libraryInfo.findMany({
            where: {
                pdeId: id,
            },
            orderBy: {
                timestamp: 'desc',
            },
            take: 1,
        });

        return {
            systemInfo: systemInfo[0],
            libraryInfo: libraryInfo[0],
        };
    }

    async updateHeartbeat({ id }: { id: number }) {
        const pde = await this.getById({
            id,
        });

        if (!pde) {
            throw new NotFoundException('PDE not found');
        }

        return await this.prisma.pDE.update({
            where: {
                id: pde.id,
            },
            data: {
                lastSeen: new Date(),
            },
        });
    }
}
