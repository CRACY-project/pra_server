import { CompanyValidation } from '@cracy/validation';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUrl, MaxLength } from 'class-validator';

import { withFilter, withGetQuery } from '@/common/queries';
import { stringToArray } from '@/decorators/string-t0-array.decorator';

export const CompanyType = {
    SUPERCOMPANY: 'SUPERCOMPANY',
    DISTRIBUTOR: 'DISTRIBUTOR',
    PARTNER: 'PARTNER',
    CUSTOMER: 'CUSTOMER',
};

export type CompanyType = (typeof CompanyType)[keyof typeof CompanyType];

export class ApiKey {
    id: number;
    key: string;
    companyId: number;
}
export class CompanyParentDto {
    id: number;
    displayName: string;
    name: string;
}
export class CompanyFaviconDto {
    id: number;
}

const companyFields: (keyof CompanyDto)[] = ['id', 'name', 'displayName', 'websiteUrl', 'companyType'];

export class CompanyDto {
    id: number;
    name: string;
    displayName: string;
    @ApiProperty({ enum: CompanyType, enumName: 'CompanyType' })
    companyType: CompanyType;
    websiteUrl?: string;
}

export class GetCompaniesResponse {
    data: CompanyDto[];
    size: number;
}

export class CompanyFilter extends withFilter<CompanyDto>({ fields: companyFields }) {}
export class CompanyFilters {
    @Type(() => Array<CompanyFilter>)
    @IsOptional()
    filters?: CompanyFilter[];
}

export class GetCompaniesQuery extends withGetQuery<CompanyDto, CompanyFilter>({
    fields: companyFields,
}) {
    @Transform(stringToArray)
    @ApiProperty({
        isArray: true,
        enum: CompanyType,
        required: false,
    })
    types?: CompanyType[];
    parentName?: string;
    grandParentName?: string;
    partnerCount?: boolean;
    name?: string;
    niacCount?: boolean;
    userCount?: boolean;
}

export class UpdateCompanyDto {
    @IsOptional()
    @IsNotEmpty()
    @MaxLength(CompanyValidation.name.maxLength)
    displayName?: string;

    @IsOptional()
    @IsNumber()
    parentId?: number;

    @IsOptional()
    @IsEmail()
    partnerUserEmail?: string;

    @IsOptional()
    @IsUrl()
    websiteUrl?: string;

    @IsOptional()
    favicon?: Buffer;

    @IsOptional()
    guidelinesAccepted?: boolean;

    @IsOptional()
    nativeDevicesEnabled?: boolean;

    @IsOptional()
    @IsEmail()
    primaryContactEmail?: string;

    @IsOptional()
    deviceLimitEnabled?: boolean;
}

export class CreateCompanyDto {
    @IsNotEmpty()
    @MaxLength(CompanyValidation.name.maxLength)
    name: string;

    @IsNotEmpty()
    @MaxLength(CompanyValidation.name.maxLength)
    displayName: string;

    @IsEnum(CompanyType)
    companyType: CompanyType = CompanyType.CUSTOMER;

    @IsOptional()
    @IsUrl()
    websiteUrl?: string;
}

export class SimpleCompanyDto {
    id: number;
    name: string;
    displayName: string;
    companyType: CompanyType;
}
