import { PDEValidation } from '@cracy/validation';
import { Type } from 'class-transformer';
import { IsArray, IsJSON, IsLowercase, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { IsOptional } from 'class-validator';

import { withFilter, withGetQuery } from '@/common/queries';
import { CompanyDto } from '@/modules/company/types/company.dto';
import { TagDto } from '@/modules/tag/types/tag.dto';

export class PDEDto {
    id: number;
    name: string;
    serialNumber: string;
    token: string;
    company?: CompanyDto;
    tags?: TagDto[];
    lastSeen: Date;
}

export class CreatePDEDto {
    @IsNotEmpty()
    @IsLowercase()
    @MaxLength(PDEValidation.name.maxLength)
    @MinLength(PDEValidation.name.minLength)
    name: string;

    @IsNotEmpty()
    serialNumber: string;

    @IsOptional()
    @IsArray()
    tags?: string[];

    @IsNotEmpty()
    @MaxLength(PDEValidation.token.maxLength)
    @MinLength(PDEValidation.token.minLength)
    token: string;
}

export class UpdatePDEDto {
    @IsNotEmpty()
    @IsLowercase()
    @MaxLength(PDEValidation.name.maxLength)
    @MinLength(PDEValidation.name.minLength)
    name: string;

    @IsNotEmpty()
    serialNumber: string;

    @IsOptional()
    @IsArray()
    tags?: string[];
}

const pdeFields = Object.keys(new PDEDto()) as (keyof PDEDto)[];

export class PDEFilter extends withFilter<PDEDto>({ fields: pdeFields }) {}
export class PDEFilters {
    @Type(() => Array<PDEFilter>)
    @IsOptional()
    filters?: PDEFilter[];
}

export class GetPDEsResponse {
    data: PDEDto[];
    size: number;
}

export class GetPDEsQuery extends withGetQuery<PDEDto, PDEFilter>({
    fields: pdeFields,
}) {}

export class PDEInfoDto {
    id: number;
    data: any;
    timestamp: Date;
    pdeId: number;

    pde?: PDEDto;
}

export class CreatePDEInfoDto {
    @IsJSON()
    @IsNotEmpty()
    data: string;
}

export class GetPDEInfoResponse {
    systemInfo: PDEInfoDto;
    libraryInfo: PDEInfoDto;
}
