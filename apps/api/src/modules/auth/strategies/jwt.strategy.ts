import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserInRequest } from '@/common/types/request-with-user.interface';

import { IAccessTokenData } from '../types/jwt';
import { UserAuthService } from '../user.auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        readonly configService: ConfigService,
        private readonly userAuthService: UserAuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    return request?.cookies?.Authentication;
                },
            ]),
            secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET') || '',
        });
    }

    async validate(payload: IAccessTokenData): Promise<UserInRequest> {
        if (!payload?.userId) throw new UnauthorizedException('Invalid token');
        const user = await this.userAuthService.getById(payload.userId);
        if (!user) throw new UnauthorizedException('Invalid token');
        return user;
    }
}
