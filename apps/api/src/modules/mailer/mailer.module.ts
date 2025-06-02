import { Module } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { generateMailerConfig } from './mailer.config';

@Module({
    providers: [
        {
            provide: MailerService,
            useFactory: () => {
                const mailerOptions = generateMailerConfig();
                // @ts-expect-error it works with null in signal
                return new MailerService(mailerOptions, null);
            },
        },
    ],
    exports: [MailerService],
})
export class MailerModule {}
