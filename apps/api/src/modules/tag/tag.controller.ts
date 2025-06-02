import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserAuthorizationGuard } from '@/common/guards/authorization.guard';
import { UserGuard } from '@/common/guards/user.guard';
import { ParseIntPipe } from '@/common/pipes/parseInt.pipe';
import { RequestWithUser } from '@/common/types/request-with-user.interface';
import { CompanyRoles } from '@/decorators';
import { TagPermissions } from '@/modules/tag/tag.permisions';

import { TagService } from './tag.service';
import { GetTagsResponse, TagDto } from './types/tag.dto';

@UseGuards(UserAuthorizationGuard)
@UseGuards(UserGuard)
@Controller({ path: 'companies/:companyName/tags', version: '1' })
@ApiTags('Tags')
export class TagController {
    constructor(private readonly tagService: TagService) {}

    @Get()
    @CompanyRoles(TagPermissions.READ)
    async getTags(@Param('companyName') companyName: string): Promise<GetTagsResponse> {
        return this.tagService.getByCompany({ companyName });
    }

    @Delete(':id')
    @CompanyRoles(TagPermissions.DELETE)
    deleteTag(
        @Param('companyName') companyName: string,
        @Param('id', new ParseIntPipe()) id: number,
        @Req() { user }: RequestWithUser
    ): Promise<TagDto> {
        return this.tagService.delete({ id, actor: user.email, companyName });
    }
}
