import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import { UserAuthorizationGuard } from '@/common/guards/authorization.guard';
import { UserGuard } from '@/common/guards/user.guard';
import { RequestWithUser } from '@/common/types';
import { CompanyRoles } from '@/decorators';
import { PDEPermissions } from '@/modules/pde/pde.permissions';
import { PDEService } from '@/modules/pde/pde.service';
import {
    CreatePDEDto,
    GetPDEInfoResponse,
    GetPDEsQuery,
    GetPDEsResponse,
    PDEDto,
    PDEFilters,
    UpdatePDEDto,
} from '@/modules/pde/types/pde.dto';

// IMPORTANT: order of guards matter -> keep jwt auth guard at bottom to add user to requests
@Controller({ path: 'companies/:companyName/pdes', version: '1' })
@UseGuards(UserAuthorizationGuard)
@UseGuards(UserGuard)
@ApiTags('PDE')
export class PDEController {
    constructor(private readonly pdeService: PDEService) {}

    @Get()
    @ApiQuery({
        name: 'filters',
        required: false,
        isArray: true,
        type: PDEFilters,
    })
    @CompanyRoles(PDEPermissions.READ)
    getManyPDE(
        @Param('companyName') companyName: string,
        @Query()
        { skip, take, search, orderBy }: GetPDEsQuery
    ): Promise<GetPDEsResponse> {
        return this.pdeService.getByCompanyName({
            companyName,
            params: {
                skip,
                take,
                orderBy,
            },
            search,
        });
    }

    @Get(':id')
    @CompanyRoles(PDEPermissions.READ)
    async getPDE(
        @Param('companyName') companyName: string,
        @Param('id', new ParseIntPipe()) id: number
    ): Promise<PDEDto> {
        const pde = await this.pdeService.getByIdAndCompany({ id, companyName });
        if (!pde) {
            throw new NotFoundException('PDE not found');
        }
        return pde;
    }

    @Delete(':id')
    @CompanyRoles(PDEPermissions.DELETE)
    deletePDE(
        @Req() { user }: RequestWithUser,
        @Param('companyName') companyName: string,
        @Param('id', new ParseIntPipe()) id: number
    ): Promise<PDEDto> {
        return this.pdeService.deleteByCompany({ id, companyName, actor: user });
    }

    @Post()
    @CompanyRoles(PDEPermissions.CREATE)
    async createPDE(
        @Body() data: CreatePDEDto,
        @Req() { user }: RequestWithUser,
        @Param('companyName') companyName: string
    ): Promise<PDEDto> {
        return this.pdeService.createForCompany({ data, actor: user, companyName });
    }

    @Patch(':id')
    @CompanyRoles(PDEPermissions.UPDATE)
    async updatePDE(
        @Req() { user }: RequestWithUser,
        @Param('companyName') companyName: string,
        @Param('id', new ParseIntPipe()) id: number,
        @Body() data: UpdatePDEDto
    ): Promise<PDEDto> {
        return this.pdeService.updateByCompany({ id, data, companyName, actor: user });
    }

    @Get(':id/info')
    @CompanyRoles(PDEPermissions.READ)
    async getPDEInfo(
        @Param('companyName') companyName: string,
        @Param('id', new ParseIntPipe()) id: number
    ): Promise<GetPDEInfoResponse> {
        return this.pdeService.getPDEInfo({ id, companyName });
    }
}
