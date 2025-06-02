import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { ApiTokenGuard, ApiTokenScope } from '@/common/guards/api.key.guard';
import { RequestWithPDE } from '@/common/types/request-with-pde.interface';
import { ApiScope } from '@/decorators/apiscopes.decorator';
import { PDEService } from '@/modules/pde/pde.service';

import { PDETokenAuthGuard, PDETokenHeaderValue } from '../auth/strategies/pde-token.strategy';

// IMPORTANT: order of guards matter -> keep jwt auth guard at bottom to add user to requests
@Controller({ path: 'pdes', version: '1' })
@UseGuards(ApiTokenGuard)
@UseGuards(PDETokenAuthGuard)
@ApiScope(ApiTokenScope.PDE)
@ApiSecurity(PDETokenHeaderValue)
@ApiTags('PDE Update')
export class PDEUpdateController {
    constructor(private readonly pdeService: PDEService) {}

    @ApiBody({
        schema: {
            type: 'object',
        },
    })
    @Post('system-info')
    async createSystemInfo(@Req() { pde }: RequestWithPDE, @Body() data: object) {
        await this.pdeService.createSystemInfo({ id: pde.id, data: JSON.stringify(data) });

        return true;
    }

    @ApiBody({
        schema: {
            type: 'object',
        },
    })
    @Post('library-info')
    async createLibraryInfo(@Req() { pde }: RequestWithPDE, @Body() data: object) {
        await this.pdeService.createLibraryInfo({ id: pde.id, data: JSON.stringify(data) });

        return true;
    }

    @Post('heartbeat')
    async sendHeartbeat(@Req() { pde }: RequestWithPDE) {
        await this.pdeService.updateHeartbeat({ id: pde.id });

        return true;
    }
}
