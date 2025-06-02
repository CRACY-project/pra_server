import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { PrismaModule } from '@/modules/prisma/prisma.module';

import { CompanySeederModule } from './company/company.seeder.module';
import { Seeder } from './seeder';
import { UserSeederModule } from './user/user.seeder.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            expandVariables: true,
            isGlobal: true,
            cache: true,
        }),
        PrismaModule,
        CompanySeederModule,
        UserSeederModule,
        EventEmitterModule.forRoot(),
    ],
    providers: [Logger, Seeder],
})
export class SeederModule {}
