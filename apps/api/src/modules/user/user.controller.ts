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
    ValidationPipe,
} from '@nestjs/common';
import { ApiExtraModels, ApiQuery, ApiTags } from '@nestjs/swagger';

import { UserAuthorizationGuard } from '@/common/guards/authorization.guard';
import { UserGuard } from '@/common/guards/user.guard';
import { RequestWithUser } from '@/common/types';
import { AllowSelf, CompanyRoles } from '@/decorators';
import { UserPermissions } from '@/modules/user/user.permissions';

import {
    CreateUserDto,
    GetUsersQuery,
    GetUsersResponse,
    UpdateUserDto,
    UserCompanyRoleDto,
    UserDto,
    UserFilters,
} from './types/user.dto';
import { UserService } from './user.service';

// IMPORTANT: order of guards matter -> keep jwt auth guard at bottom to add user to requests
@Controller({ path: 'companies/:companyName/users', version: '1' })
@UseGuards(UserAuthorizationGuard)
@UseGuards(UserGuard)
@ApiTags('Users')
@ApiExtraModels(UserCompanyRoleDto)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @ApiQuery({
        name: 'filters',
        required: false,
        isArray: true,
        type: UserFilters,
    })
    @CompanyRoles(UserPermissions.READ)
    getUsers(
        @Param('companyName') companyName: string,
        @Query()
        { roles, skip, take, email, platformRoles, search, orderBy }: GetUsersQuery
    ): Promise<GetUsersResponse> {
        console.log('search', search);
        return this.userService.getByCompanyName({
            companyName,
            params: {
                skip,
                take,
                orderBy,
            },
            search,
            email,
            roles,
            platformRoles,
        });
    }

    @Get(':userId')
    @CompanyRoles(UserPermissions.READ)
    @AllowSelf()
    async getUser(
        @Param('companyName') companyName: string,
        @Param('userId', new ParseIntPipe()) id: number
    ): Promise<UserDto> {
        const requestedUser = await this.userService.getByIdAndCompany({ id, companyName });
        if (!requestedUser) throw new NotFoundException();
        return requestedUser;
    }

    @Delete(':userId')
    @CompanyRoles(UserPermissions.DELETE)
    async deleteUser(
        @Req() { user }: RequestWithUser,
        @Param('companyName') companyName: string,
        @Param('userId') id: number
    ): Promise<UserDto> {
        return this.userService.deleteUserForCompany({ id, companyName, actor: user });
    }

    @Post()
    @CompanyRoles(UserPermissions.CREATE)
    async createUser(
        @Body(new ValidationPipe({ whitelist: true })) data: CreateUserDto,
        @Req() { user }: RequestWithUser,
        @Param('companyName') companyName: string
    ) {
        return this.userService.createUserForCompany({ data, actor: user.email, companyName });
    }

    @Patch(':userId')
    @CompanyRoles(UserPermissions.UPDATE)
    async updateUser(
        @Req() { user }: RequestWithUser,
        @Param('companyName') companyName: string,
        @Param('userId', new ParseIntPipe()) userId: number,
        @Body(new ValidationPipe({ whitelist: true })) data: UpdateUserDto
    ): Promise<UserDto> {
        return this.userService.updateUserForCompany({ userId, data, companyName, actor: user });
    }
}
