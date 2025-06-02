import { CompanyDto } from '@/modules/company/types/company.dto';

export class TagDto {
    id: number;
    name: string;
    company?: CompanyDto;
    companyId?: number;
}

export class GetTagsResponse {
    tags: TagDto[];
    size: number;
}
