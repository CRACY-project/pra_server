import { Module } from '@nestjs/common';

import { CompanyController } from '@/modules/company/company.controller';
import { CompanyService } from '@/modules/company/company.service';
import { PrismaModule } from '@/modules/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [CompanyService],
    controllers: [CompanyController],
    exports: [CompanyService],
})
export class CompanyModule {}
