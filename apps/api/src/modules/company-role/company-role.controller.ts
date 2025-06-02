import { UserCompanyRoleValue } from '@cracy/database';
import { Controller, Delete, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserAuthorizationGuard } from '@/common/guards/authorization.guard';
import { UserGuard } from '@/common/guards/user.guard';
import { CompanyRoles } from '@/decorators';

import { CompanyRoleService } from './company-role.service';
import { CompanyUserRoleDto, GetRolesQuery, SimpleCompanyUserRoleDto } from './types/company-role.dto';

@Controller({ path: 'companies/:companyName/roles', version: '1' })
@UseGuards(UserAuthorizationGuard)
@UseGuards(UserGuard)
@ApiTags('Company Roles')
export class CompanyRoleController {
    constructor(private readonly companyRoleService: CompanyRoleService) {}

    @CompanyRoles(UserCompanyRoleValue.COMPANYADMIN)
    @Get()
    async getCompanyRoles(
        @Param('companyName') companyName: string,
        @Query() { userId, fields, values }: GetRolesQuery
    ): Promise<CompanyUserRoleDto[]> {
        return this.companyRoleService.getRolesForCompany({ companyName, params: { fields, values, userId } });
    }

    @CompanyRoles(UserCompanyRoleValue.COMPANYADMIN)
    @Delete(':id')
    async deleteCompanyRole(
        @Param('companyName') companyName: string,
        @Param('id', ParseIntPipe) id: number
    ): Promise<SimpleCompanyUserRoleDto> {
        return this.companyRoleService.deleteCompanyRole({ id, companyName });
    }
}
