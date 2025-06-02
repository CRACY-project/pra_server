import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { UserGuard } from '@/common/guards/user.guard';
import { AuthUser, UserDto } from '@/modules/user/types/user.dto';

import { RequestWithUser } from '../../common/types/request-with-user.interface';
import { AuthService } from './auth.service';
import { JwtRefreshAuthGuard } from './strategies/jwt-refresh.strategy';
import { RefreshTokenDto, VerifyEmailDto, VerifyIdDto, VerifyTokenDto } from './types/auth.dto';
import { UserAuthService } from './user.auth.service';

@Controller({ path: 'auth', version: '1' })
@ApiTags('Authentication')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userAuthService: UserAuthService
    ) {}

    @Post('verify-google-id')
    async verifyGoogleId(
        @Req() req: Request,
        @Body(new ValidationPipe({ whitelist: true })) postData: VerifyIdDto
    ): Promise<UserDto> {
        const user = await this.authService.verifyGoogleId(postData);
        this.setLoginCookies(req, user);
        return user;
    }

    @Post('send-user-token-code')
    @HttpCode(HttpStatus.OK)
    async sendUserTokenCode(@Body() postData: VerifyEmailDto): Promise<boolean> {
        await this.authService.sendUserTokenCode({ to: postData.email });
        return true;
    }

    @Post('verify-email-token')
    @HttpCode(HttpStatus.OK)
    async verifyToken(@Req() req: Request, @Body() postData: VerifyTokenDto): Promise<UserDto> {
        const user = await this.authService.verifyToken({
            token: postData.token,
            email: postData.email,
        });
        this.setLoginCookies(req, user);
        return user;
    }

    @Post('verify-microsoft-id')
    async verifyMicrosoftId(
        @Req() req: Request,
        @Body(new ValidationPipe({ whitelist: true })) postData: VerifyIdDto
    ): Promise<UserDto> {
        const user = await this.authService.verifyAzureId({
            token: postData.idToken,
        });
        this.setLoginCookies(req, user);
        return user;
    }

    @Get('refresh')
    @UseGuards(JwtRefreshAuthGuard)
    refreshAccessToken(@Req() req: RequestWithUser): RefreshTokenDto {
        const { token, cookie } = this.authService.getCookieWithJWT({
            userId: req.user.id,
        });
        if (req.res) {
            req.res.setHeader('Set-Cookie', cookie);
        }
        return {
            accessToken: token,
        };
    }

    @Get('me')
    @UseGuards(UserGuard)
    getProfile(@Req() { user }: RequestWithUser): AuthUser {
        return {
            ...user,
            accessToken: '',
        };
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @UseGuards(UserGuard)
    async logout(@Req() req: RequestWithUser) {
        await this.userAuthService.removeRefreshToken(req.cookies['Refresh']);
        req.res?.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
        return true;
    }

    private setLoginCookies(req: Request, user: { accessTokenCookie: string; refreshTokenCookie: string }) {
        const { accessTokenCookie, refreshTokenCookie } = user;
        req.res?.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    }
}
