import { MailerOptions } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';

import { mailFrom } from '@/config';

export const generateMailerConfig = () => {
    let transporter: string;

    if (!process.env.GOOGLE_APP_USERNAME || !process.env.GOOGLE_APP_PASSWORD) {
        transporter = createMailDevTransporter();
    } else {
        transporter = `smtps://${process.env.GOOGLE_APP_USERNAME}:${process.env.GOOGLE_APP_PASSWORD}@smtp.gmail.com`;
    }

    return {
        transport: transporter,
        defaults: {
            from: `"cracy" <${mailFrom}>`,
        },
        template: {
            dir: join(process.cwd(), 'templates'),
            adapter: new EjsAdapter(),
        },
    } as MailerOptions;
};

// https://github.com/maildev/maildev
// browse to http://localhost:1080
const createMailDevTransporter = () => {
    return 'smtp://localhost:1025';
};
