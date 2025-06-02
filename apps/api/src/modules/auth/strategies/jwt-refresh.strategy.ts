/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserAuthService } from '../user.auth.service';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh-token') {}

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    constructor(
        readonly configService: ConfigService,
        private readonly userAuthService: UserAuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.Refresh;
                },
            ]),
            secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET') || '',
            passReqToCallback: true,
        });
    }

    async validate(request: Request) {
        const refreshToken = request.cookies?.Refresh as string;
        return this.userAuthService.getByRefreshToken(refreshToken);
    }
}
