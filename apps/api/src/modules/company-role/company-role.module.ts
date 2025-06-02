import { forwardRef, Module } from '@nestjs/common';

import { PrismaModule } from '@/modules/prisma/prisma.module';

import { CompanyModule } from '../company/company.module';
import { CompanyRoleController } from './company-role.controller';
import { CompanyRoleService } from './company-role.service';

@Module({
    imports: [forwardRef(() => CompanyModule), PrismaModule],
    providers: [CompanyRoleService],
    controllers: [CompanyRoleController],
    exports: [CompanyRoleService],
})
export class UserCompanyRoleModule {}
