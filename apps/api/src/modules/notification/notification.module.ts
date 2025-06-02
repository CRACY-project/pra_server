import { Module } from '@nestjs/common';

import { PrismaModule } from '@/modules/prisma/prisma.module';

import { MailerModule } from '../mailer/mailer.module';
import { NotificationService } from './notification.service';

@Module({
    imports: [MailerModule, PrismaModule],
    providers: [NotificationService],
    controllers: [],
    exports: [NotificationService],
})
export class NotificationModule {}
