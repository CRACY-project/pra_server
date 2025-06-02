import { AuthenticationType, UserCompanyRoleValue } from '@cracy/database';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { withFilter, withGetQuery } from '@/common/queries';
import { stringToArray } from '@/decorators/string-t0-array.decorator';
import { CompanyDto } from '@/modules/company/types/company.dto';
import { CompanyUserRoleDto } from '@/modules/company-role/types/company-role.dto';

export const PlatformUserRoleValue = {
    USER: 'USER',
    SUPERADMIN: 'SUPERADMIN',
};
export type PlatformUserRoleValue = (typeof PlatformUserRoleValue)[keyof typeof PlatformUserRoleValue];

export const SupportedUserRelationalFilters = ['userRoles.some.company.name', 'userRoles.some.value'];

export const MappedUserRole = {
    USER: 'User',
    SUPERADMIN: 'Super Admin',
    COMPANYADMIN: 'Company Admin',
};

export class UserDto {
    @ApiProperty({ enum: AuthenticationType })
    authenticationType: AuthenticationType;

    @Expose()
    id: number;
    @Expose()
    email: string;

    profilePicture?: string;

    @ApiProperty({ isArray: true, type: CompanyUserRoleDto })
    @Expose()
    userRoles?: CompanyUserRoleDto[];

    @Expose()
    companyId: number;

    company: CompanyDto;

    @ApiProperty({ enum: PlatformUserRoleValue, enumName: 'PlatformUserRoleValue' })
    @Expose()
    platformRole: PlatformUserRoleValue;

    @Expose()
    disabled?: boolean;

    @Exclude()
    password?: string;
}

export class AuthUser extends UserDto {
    @Expose()
    accessToken: string;

    @Expose()
    declare company: CompanyDto;
}

export class UpdateUserDto {
    @IsEmail({}, { message: 'Email is invalid' })
    @IsOptional()
    email?: string;

    @ApiProperty({ isArray: true, enum: UserCompanyRoleValue, required: false, enumName: 'UserCompanyRoleValue' })
    @IsEnum(UserCompanyRoleValue, { each: true })
    @IsOptional()
    roles?: UserCompanyRoleValue[];

    @ApiProperty({ enum: PlatformUserRoleValue, required: false, enumName: 'PlatformUserRoleValue' })
    @IsEnum(PlatformUserRoleValue)
    @IsOptional()
    platformRole?: PlatformUserRoleValue;

    @IsOptional()
    profilePicture?: string;

    @IsOptional()
    disabled?: boolean;
}

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail({}, { message: 'Email is invalid' })
    email: string;

    @ApiProperty({ isArray: true, enum: UserCompanyRoleValue, required: false, enumName: 'UserCompanyRoleValue' })
    @IsEnum(UserCompanyRoleValue, { each: true })
    @IsOptional()
    roles?: UserCompanyRoleValue[];

    @ApiProperty({ enum: PlatformUserRoleValue, required: false, enumName: 'PlatformUserRoleValue' })
    @IsEnum(PlatformUserRoleValue)
    @IsOptional()
    platformRole?: PlatformUserRoleValue;

    @IsOptional()
    disabled?: boolean;
}

export const userFields: (keyof UserDto)[] = [
    'id',
    'email',
    'profilePicture',
    'userRoles',
    'companyId',
    'company',
    'platformRole',
    'disabled',
    'authenticationType',
];

export class GetUserQuery {
    @IsOptional()
    @Transform(stringToArray)
    @Type(() => String)
    @ApiProperty({
        isArray: true,
        enum: userFields,
        required: false,
    })
    fields?: (keyof UserDto)[];
}

export class UserFilter extends withFilter<UserDto>({ fields: userFields }) {}
export class UserFilters {
    @Type(() => Array<UserFilter>)
    @IsOptional()
    filters?: UserFilter[];
}

export class GetUsersQuery extends withGetQuery<UserDto, UserFilter>({
    fields: userFields,
}) {
    @Transform(stringToArray)
    @IsOptional()
    @IsArray()
    @ApiProperty({ isArray: true, enum: UserCompanyRoleValue, required: false, enumName: 'UserCompanyRoleValue' })
    @IsEnum(UserCompanyRoleValue, { each: true })
    roles?: UserCompanyRoleValue[];

    @Transform(stringToArray)
    @IsOptional()
    @IsArray()
    @ApiProperty({ enum: PlatformUserRoleValue, isArray: true, required: false, enumName: 'PlatformUserRoleValue' })
    @IsEnum(PlatformUserRoleValue, { each: true })
    platformRoles?: PlatformUserRoleValue[];

    @IsOptional()
    email?: string;

    @IsOptional()
    includeExternalUsers?: boolean;
}

export class GetUsersResponse {
    users: UserDto[];
    size: number;
}

export class UserCompanyRoleDto {
    id: number;
    userId: number;
    companyId: number;
    user: UserDto;
}

export class SimpleUserDto {
    email: string;
    userRoles?: CompanyUserRoleDto[];
}
