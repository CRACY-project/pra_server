import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { API_SCOPES_KEY } from '@/decorators/apiscopes.decorator';
import { PrismaService } from '@/modules/prisma/prisma.service';

import { RequestWithPDE } from '../types/request-with-pde.interface';

export enum ApiTokenScope {
    PDE = 'pde',
}

@Injectable()
export class ApiTokenGuard implements CanActivate {
    constructor(
        private prisma: PrismaService,
        private reflector: Reflector
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const apiKey = Array.isArray(request.headers['x-token'])
            ? request.headers['x-token'][0]
            : request.headers['x-token'];

        const scope = this.reflector.getAllAndOverride<ApiTokenScope>(API_SCOPES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (scope == ApiTokenScope.PDE) {
            const pde = await this.prisma.pDE.findUnique({
                where: {
                    token: apiKey,
                },
            });
            if (!pde) throw new UnauthorizedException('Invalid API Token Key');
            (request as RequestWithPDE).pde = pde;
            return true;
        }

        throw new UnauthorizedException('No access');
    }
}
