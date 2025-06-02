import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { IStrategyOptions, Strategy } from 'passport-http-header-strategy';

import { PrismaService } from '@/modules/prisma/prisma.service';

export const PDETokenHeaderValue = 'x-token';

@Injectable()
export class PDETokenAuthGuard extends AuthGuard('pde-token') {}

@Injectable()
export class PDETokenStrategy extends PassportStrategy(Strategy, 'pde-token') {
    constructor(private readonly prisma: PrismaService) {
        const options: IStrategyOptions = { header: PDETokenHeaderValue, passReqToCallback: true };
        super(options);
    }

    async validate({ params }: Request, token: string) {
        const pde = await this.prisma.pDE.findUnique({
            where: { token, company: { name: params.companyName } },
        });
        if (!pde) return null;
        return pde;
    }
}
