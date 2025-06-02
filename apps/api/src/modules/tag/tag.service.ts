import { Prisma, Tag } from '@cracy/database';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/modules/prisma/prisma.service';

@Injectable()
export class TagService {
    constructor(private readonly prisma: PrismaService) {}

    async getByCompany({ companyName }: { companyName: string }) {
        const where: Prisma.TagWhereInput = {
            company: {
                name: companyName,
            },
        };
        const tags = this.prisma.tag.findMany({
            where,
            include: {
                company: true,
            },
        });
        const size = this.prisma.tag.count({
            where,
        });
        return { tags: await tags, size: await size };
    }

    async delete({ id, companyName }: { id: number; actor: string; companyName: string }) {
        const deleted = await this.prisma.tag.delete({
            where: {
                id: id,
                company: {
                    name: companyName,
                },
            },
        });
        return deleted;
    }

    async create({ companyId, tags }: { companyId: number; tags: string[] }): Promise<Tag[]> {
        const created = await Promise.all(
            tags.map(async tag => {
                return await this.prisma.tag.upsert({
                    create: {
                        name: tag,
                        companyId,
                    },
                    update: {},
                    where: {
                        name_companyId: {
                            companyId,
                            name: tag,
                        },
                    },
                });
            })
        );
        return created;
    }
}
