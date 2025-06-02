import { Prisma } from '@cracy/database';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { stringToArray } from '@/decorators/string-t0-array.decorator';
import { stringToNum } from '@/decorators/string-to-num.decorator';
import { CompanyDto } from '@/modules/company/types/company.dto';
import { SimpleUserDto, UserDto } from '@/modules/user/types/user.dto';

export class UserRole {
    id: number;
    value: UserCompanyRoleValue;
    userId: number | null;
    companyId: number;
    company?: CompanyDto;
}

export const UserCompanyRoleValue = {
    USER: 'USER',
    SECURITYCONSULTANT: 'SECURITYCONSULTANT',
    PARTNERMANAGER: 'PARTNERMANAGER',
    COMPANYADMIN: 'COMPANYADMIN',
};

export type UserCompanyRoleValue = (typeof UserCompanyRoleValue)[keyof typeof UserCompanyRoleValue];

export class CompanyUserRoleDto {
    id: number;

    @ApiProperty({ enum: UserCompanyRoleValue, enumName: 'UserCompanyRoleValue' })
    value: UserCompanyRoleValue;

    userId: number;
    companyId: number;

    user?: UserDto;
    company?: CompanyDto;
}

export class CreateCompanyRoleDto {
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsEnum(UserCompanyRoleValue, { each: true })
    value: UserCompanyRoleValue;
}

export class GetRolesQuery {
    fields?: (keyof UserRole)[];
    @Transform(stringToArray)
    @ApiProperty({
        isArray: true,
        enum: UserCompanyRoleValue,
        required: false,
    })
    values: UserCompanyRoleValue[];
    @Transform(stringToNum)
    userId?: number;
}

export class GetRolesParams {
    orderBy?: Prisma.UserRoleOrderByWithRelationInput;
    @Transform(stringToNum)
    userId?: number;
    @Transform(stringToArray)
    @ApiProperty({
        isArray: true,
        enum: UserCompanyRoleValue,
        required: false,
    })
    values?: UserCompanyRoleValue[];
    fields?: (keyof UserRole)[];
}

export class GetRolesRequest {
    companyName: string;
    params: GetRolesParams;
}

export class SimpleCompanyUserRoleDto {
    id: number;

    @ApiProperty({ enum: UserCompanyRoleValue, enumName: 'UserCompanyRoleValue' })
    value: UserCompanyRoleValue;

    userId: number;
    companyId: number;

    user?: SimpleUserDto;
}
