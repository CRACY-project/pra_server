import { AuthenticationType } from '@cracy/database';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { decode } from 'jsonwebtoken';

import { azureAuthConfig, baseUrl, googleAuthConfig } from '@/config';
import { NotificationService } from '@/modules/notification/notification.service';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { isTimeGreaterThanMinutes, isTimeLesserThanMinute as isTimeLesserThanMinutes } from '@/utils/datetime-utils';
import { generateUserToken } from '@/utils/generate-user-token';

import { IRefreshTokenData } from './types/jwt';
import { UserAuthService } from './user.auth.service';

@Injectable()
export class AuthService {
    private client: OAuth2Client;

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly userAuthService: UserAuthService,
        private readonly prisma: PrismaService,
        private readonly notificationService: NotificationService
    ) {
        this.client = new OAuth2Client(googleAuthConfig.clientId);
    }

    public async sendUserTokenCode({ to }: { to: string }) {
        const oldUserToken = await this.userAuthService.getOneTimePasswordForUser(to);
        if (oldUserToken && isTimeLesserThanMinutes(oldUserToken.createdAt.getTime(), 10)) {
            throw new BadRequestException('You will be able to request a new token in 10 minutes.');
        }

        let userToken = generateUserToken();
        // keep generating a token until it is unique
        while (await this.userAuthService.getByOneTimePassword(userToken)) {
            userToken = generateUserToken();
        }

        await this.userAuthService.createOneTimePasswordForUser(to, userToken);

        this.notificationService
            .sendNotification({
                subject: `One Time Login Code`,
                companyName: 'NI Platform',
                template: './email_token.ejs',
                context: {
                    code: userToken.toString(),
                    baseUrl,
                },
                to: to,
            })
            .catch(() => {});
    }

    public async verifyToken({ token, email }: { token: string; email: string }) {
        const userToken = await this.userAuthService.getOneTimePasswordForUser(email);
        if (!userToken) {
            throw new UnauthorizedException('Unauthorized');
        }

        if (isTimeGreaterThanMinutes(userToken.createdAt.getTime(), 5)) {
            throw new UnauthorizedException('token expired');
        }

        if (userToken.failedAttempts >= 5) {
            throw new BadRequestException('Too many attempts. You will be able to request a new token in 10 minutes.');
        }

        if (userToken.otp !== token) {
            await this.prisma.oneTimePassword.update({
                where: {
                    id: userToken.id,
                },
                data: {
                    failedAttempts: {
                        increment: 1,
                    },
                },
            });
            throw new UnauthorizedException('Unauthorized');
        }

        // All checks passed, safe to delete now
        await this.prisma.oneTimePassword.delete({
            where: {
                id: userToken.id,
            },
        });

        return await this.registerOauthUser({ email: email }, AuthenticationType.EMAIL);
    }

    public getCookieWithJWT({ userId }: { userId: number }) {
        const payload = { userId };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: `${this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`,
        });
        const cookie = `Authentication=${token}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=${this.configService.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_TIME'
        )}`;
        return {
            cookie,
            token,
        };
    }

    public getCookieWithRefreshJWT({ userId }: { userId: number }) {
        const payload: IRefreshTokenData = { userId };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: `${this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
        });
        const cookie = `Refresh=${token}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=${this.configService.get<string>(
            'JWT_REFRESH_TOKEN_EXPIRATION_TIME'
        )}`;
        return {
            cookie,
            token,
        };
    }

    public getCookiesForLogOut() {
        return ['Authentication=; HttpOnly; Path=/; Max-Age=0', 'Refresh=; HttpOnly; Path=/; Max-Age=0'];
    }

    async verifyGoogleId({ idToken }: { idToken: string }) {
        const ticket = await this.client.verifyIdToken({
            idToken,
            audience: googleAuthConfig.clientId,
        });
        const payload = ticket.getPayload();
        if (!payload) throw new UnauthorizedException('Invalid token');
        if (!payload.email) throw new UnauthorizedException('Invalid token');
        return this.registerOauthUser({ email: payload.email }, AuthenticationType.GOOGLE);
    }

    async verifyAzureId({ token }: { token: string }) {
        const dec = decode(token) as { iss: string };
        const { verify } = await import('azure-ad-verify-token');
        const decoded = await verify(token, {
            ...azureAuthConfig,
            issuer: dec.iss,
        });
        if (typeof decoded === 'string') {
            throw new UnauthorizedException('Invalid token');
        }
        return this.registerOauthUser(
            {
                email: decoded.preferred_username as string,
            },
            AuthenticationType.AZUREAD
        );
    }

    async registerOauthUser(payload: { email: string; picture?: string }, authenticationType: AuthenticationType) {
        const user = await this.userAuthService.getByEmail(payload.email);
        if (!user) throw new BadRequestException('User not found');
        if (!user.companyId) throw new BadRequestException('Company not registered');
        if (user.disabled) throw new BadRequestException('User is disabled');

        await this.userAuthService.updateAuthenticationType(user.id, authenticationType);

        const { token: accessToken, cookie: accessTokenCookie } = this.getCookieWithJWT({ userId: user.id });
        const { token: refreshToken, cookie: refreshTokenCookie } = this.getCookieWithRefreshJWT({ userId: user.id });
        await this.userAuthService.setCurrentRefreshToken(refreshToken, user.id);
        return {
            ...user,
            accessToken,
            accessTokenCookie,
            refreshTokenCookie,
        };
    }
}
