import { AuthenticationType, PlatformUserRoleValue, Prisma, User, UserCompanyRoleValue } from '@cracy/database';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './types/user.dto';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    constructor(private readonly prisma: PrismaService) {}

    async getById({ id }: { id: number }) {
        try {
            return this.prisma.user.findUnique({
                where: {
                    id,
                },
                include: {
                    company: true,
                    userRoles: {
                        include: {
                            company: true,
                        },
                    },
                },
            });
        } catch {
            return null;
        }
    }

    async getByIdAndCompany({ id, companyName }: { id: number; companyName: string }) {
        try {
            return this.prisma.user.findUnique({
                where: {
                    id,
                    company: {
                        name: companyName,
                    },
                },
                include: {
                    company: true,
                    userRoles: {
                        include: {
                            company: true,
                        },
                    },
                },
            });
        } catch (e) {
            console.log('error', e);
            return null;
        }
    }

    async getByEmail({ email }: { email: string }) {
        try {
            return this.prisma.user.findUnique({
                where: {
                    email,
                },
                include: {
                    company: true,
                    userRoles: true,
                },
            });
        } catch {
            return null;
        }
    }

    async getByCompanyName({
        companyName,
        params,
        search,
        email,
        roles,
        platformRoles,
    }: {
        companyName: string;
        params?: {
            skip?: number;
            take?: number;
            orderBy?: Prisma.UserOrderByWithRelationInput;
        };
        search?: string;
        email?: string;
        roles?: UserCompanyRoleValue[];
        platformRoles?: string[];
    }) {
        const where: Prisma.UserWhereInput = {};

        if (roles) {
            where.userRoles = {
                some: {
                    value: {
                        in: roles,
                    },
                },
            };
        }
        if (email) {
            where.email = email;
        }
        if (platformRoles) {
            where.platformRole = {
                in: platformRoles as PlatformUserRoleValue[],
            };
        }
        if (search) {
            console.log('search', search);
            where.email = {
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
        console.log('where', where);

        const users = await this.prisma.user.findMany({
            ...params,
            orderBy: params?.orderBy
                ? params.orderBy
                : {
                      id: 'desc',
                  },
            where,
            include: {
                company: true, // do we have to include company?
                userRoles: {
                    where: {
                        company: {
                            name: companyName,
                        },
                    },
                },
            },
        });

        const size = await this.prisma.user.count({
            where,
        });

        return { users, size };
    }

    async createUserForCompany({ data, companyName }: { data: CreateUserDto; companyName: string; actor: string }) {
        try {
            const company = await this.prisma.company.findUnique({ where: { name: companyName } });
            if (!company) throw new BadRequestException('Company not found');

            const userCreateData: Prisma.UserCreateInput = {
                email: data.email,
                userRoles: {
                    createMany: {
                        data: this.createUserRoles(data, company.id),
                        skipDuplicates: true,
                    },
                },
                company: {
                    connect: {
                        name: companyName,
                    },
                },
                authenticationType: AuthenticationType.UNCLAIMED,
                platformRole: data.platformRole as PlatformUserRoleValue,
                disabled: data.disabled,
            };

            const user = await this.prisma.user.create({
                data: userCreateData,
                include: {
                    company: true,
                    userRoles: {
                        where: {
                            companyId: company.id,
                        },
                    },
                },
            });
            return user;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new BadRequestException('User already exists');
                }
            }
            throw new BadRequestException(error);
        }
    }

    async getAllByDomain(companyId: number, domain: string) {
        return await this.prisma.user.findMany({
            where: {
                AND: [{ companyId, email: { contains: `@${domain}` } }],
            },
        });
    }

    async reassignCompanies({
        domain,
        oldDomain,
        companyId,
    }: {
        domain: string;
        oldDomain: string;
        companyId: number;
        actor: string;
    }) {
        if (!oldDomain) {
            const users = await this.getAllByDomain(companyId, domain);
            return this.prisma.user.updateMany({
                where: {
                    id: {
                        in: users.map((user: User) => user.id),
                    },
                },
                data: {
                    companyId,
                },
            });
        }
    }

    async deleteUserForCompany({ id, companyName }: { id: number; companyName: string; actor: User }) {
        const deleted = await this.prisma.user.delete({
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
        return deleted;
    }

    async updateUserForCompany({
        userId,
        data,
        companyName,
    }: {
        userId: number;
        data: UpdateUserDto;
        companyName: string;
        actor: User;
    }) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId,
                    company: {
                        name: companyName,
                    },
                },
                include: {
                    company: true,
                    userRoles: {
                        where: {
                            company: {
                                name: companyName,
                            },
                        },
                    },
                },
            });
            if (!user) throw new BadRequestException('User not found');

            const userUpdateData: Prisma.UserUpdateInput = this.mapUpdateUserDtoToUserUpdateInput(data, user.companyId);

            const updatedUser = await this.prisma.user.update({
                data: userUpdateData,
                where: {
                    id: user.id,
                },
                include: {
                    company: true,
                    userRoles: {
                        where: {
                            company: {
                                name: companyName,
                            },
                        },
                    },
                },
            });
            return updatedUser;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new BadRequestException('User already exists');
                }
            }
            throw new BadRequestException(error);
        }
    }

    mapUpdateUserDtoToUserUpdateInput = (data: UpdateUserDto, companyId: number): Prisma.UserUpdateInput => {
        const userUpdateData: Prisma.UserUpdateInput = {};
        if (data.platformRole) {
            if (data.platformRole === PlatformUserRoleValue.SUPERADMIN) {
                delete data.platformRole;
                this.logger.warn('Cannot set user as superadmin');
            }
            userUpdateData.platformRole = data.platformRole as PlatformUserRoleValue;
        }
        if (data.roles) {
            const roles = this.createUserRoles(data, companyId);
            userUpdateData.userRoles = {
                deleteMany: {
                    companyId,
                },
                createMany: {
                    data: roles,
                    skipDuplicates: true,
                },
            };
        }

        if (data.disabled !== undefined) {
            userUpdateData.disabled = data.disabled;
        }

        if (data.email) {
            userUpdateData.email = data.email;
        }

        return userUpdateData;
    };

    createUserRoles(data: CreateUserDto | UpdateUserDto, companyId: number) {
        const userRoles: Prisma.UserRoleCreateManyUserInput[] = [
            {
                value: UserCompanyRoleValue.USER,
                companyId,
            },
        ];

        if (data.roles) {
            for (const role of data.roles) {
                userRoles.push({
                    companyId,
                    value: role,
                });
            }
        }
        return userRoles;
    }
}
