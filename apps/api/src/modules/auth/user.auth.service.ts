import { AuthenticationType } from '@cracy/database';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash } from 'crypto';

import { PrismaService } from '@/modules/prisma/prisma.service';

@Injectable()
export class UserAuthService {
    constructor(private readonly prisma: PrismaService) {}

    async getByOneTimePassword(otp: string) {
        return await this.prisma.oneTimePassword
            .findUnique({
                where: {
                    otp,
                },
            })
            .user();
    }

    async getOneTimePasswordForUser(email: string) {
        return await this.prisma.oneTimePassword.findFirst({ where: { user: { email } } });
    }

    async createOneTimePasswordForUser(email: string, otp: string) {
        return await this.prisma.oneTimePassword.create({
            data: {
                otp,
                user: {
                    connect: {
                        email,
                    },
                },
            },
        });
    }

    async validateUserToken(otp: string) {
        const user = await this.prisma.oneTimePassword
            .findUnique({
                where: {
                    otp,
                },
            })
            .user();
        if (!user) throw new UnauthorizedException('Invalid token');
        return user;
    }

    async getByEmail(email: string) {
        return await this.prisma.user.findUnique({
            where: {
                email,
            },
            include: {
                company: true,
                userRoles: true,
            },
        });
    }

    async setCurrentRefreshToken(refreshToken: string, userId: number) {
        const hashedToken = createHash('sha256').update(refreshToken).digest('hex');
        await this.prisma.refreshToken.create({
            data: {
                currentHashedRefreshToken: hashedToken,
                userId,
            },
        });
    }

    async removeRefreshToken(refreshToken: string) {
        const hashedToken = createHash('sha256').update(refreshToken).digest('hex');
        await this.prisma.refreshToken.delete({
            where: {
                currentHashedRefreshToken: hashedToken,
            },
        });
    }

    async getByRefreshToken(refreshToken: string) {
        const hashedToken = createHash('sha256').update(refreshToken).digest('hex');
        const refreshTokenData = await this.prisma.refreshToken.findUnique({
            where: {
                currentHashedRefreshToken: hashedToken,
            },
            include: {
                user: true,
            },
        });
        if (!refreshTokenData) throw new UnauthorizedException();
        return refreshTokenData.user;
    }

    async updateAuthenticationType(id: number, type: AuthenticationType) {
        return await this.prisma.user.update({
            where: {
                id: id,
            },
            data: {
                authenticationType: type,
            },
            include: {
                userRoles: true,
            },
        });
    }

    async getById(id: number) {
        return await this.prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                company: true,
                userRoles: true,
            },
        });
    }
}
