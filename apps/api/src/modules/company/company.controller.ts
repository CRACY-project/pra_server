import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserAuthorizationGuard } from '@/common/guards/authorization.guard';
import { SuperAdminGuard } from '@/common/guards/superadmin.guard';
import { UserGuard } from '@/common/guards/user.guard';
import { CompanyRoles } from '@/decorators';
import { CompanyPermissions } from '@/modules/company/company.permissions';

import { RequestWithUser } from '../../common/types/request-with-user.interface';
import { GetUsersQuery } from '../user/types/user.dto';
import { CompanyService } from './company.service';
import {
    CompanyDto,
    CreateCompanyDto,
    GetCompaniesQuery,
    GetCompaniesResponse,
    UpdateCompanyDto,
} from './types/company.dto';

@Controller({ path: 'companies', version: '1' })
@UseGuards(UserAuthorizationGuard)
@UseGuards(UserGuard)
@ApiTags('Companies')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Post()
    @UseGuards(SuperAdminGuard)
    createCompany(@Body() postData: CreateCompanyDto, @Req() { user }: RequestWithUser): Promise<CompanyDto> {
        return this.companyService.createCustomer({ data: postData, actor: user });
    }

    @Get('')
    @UseGuards(SuperAdminGuard)
    async getCustomers(
        @Query()
        { skip, take, search, orderBy }: GetCompaniesQuery
    ): Promise<GetCompaniesResponse> {
        return this.companyService.getCustomers({
            params: {
                orderBy,
                skip,
                take,
            },
            search,
        });
    }

    @Get(':companyName')
    @CompanyRoles(CompanyPermissions.READ)
    async getCompanyByName(@Param('companyName') companyName: string): Promise<CompanyDto> {
        const company = await this.companyService.getByName({ name: companyName });
        if (!company) throw new NotFoundException();
        return company;
    }

    @Patch(':companyName')
    @CompanyRoles(CompanyPermissions.UPDATE)
    updateCompany(
        @Param('companyName') companyName: string,
        @Body() postData: UpdateCompanyDto,
        @Req() { user }: RequestWithUser
    ): Promise<CompanyDto> {
        return this.companyService.updateCompany({ name: companyName, data: postData, actor: user });
    }

    // This seems like a dangerous endpoint, make it multiple steps? email verification?
    @Delete(':companyName')
    @CompanyRoles(CompanyPermissions.DELETE)
    deleteCompany(@Param('companyName') companyName: string, @Req() { user }: RequestWithUser): Promise<CompanyDto> {
        return this.companyService.deleteCompany({ name: companyName, actor: user });
    }
}
