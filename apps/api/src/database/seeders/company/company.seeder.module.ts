import { Module } from '@nestjs/common';

import { PrismaModule } from '@/modules/prisma/prisma.module';

import { CompanySeederService } from './company.seeder.service';

@Module({
    imports: [PrismaModule],
    providers: [CompanySeederService],
    exports: [CompanySeederService],
})
export class CompanySeederModule {}
