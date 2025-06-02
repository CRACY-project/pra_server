import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import { AuthModule } from '@/modules/auth/auth.module';
import { CompanyModule } from '@/modules/company/company.module';
import { PDEModule } from '@/modules/pde/pde.module';
import { TagModule } from '@/modules/tag/tag.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            expandVariables: true,
            isGlobal: true,
            cache: true,
        }),
        MailerModule,
        PDEModule,
        UserModule,
        AuthModule,
        TagModule,
        CompanyModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
