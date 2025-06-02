import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Attachment } from 'nodemailer/lib/mailer';

import { mailFrom } from '@/config';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);
    private readonly toAddress: string;
    constructor(private readonly mailerService: MailerService) {
        this.toAddress = mailFrom;
    }

    async sendNotification({
        subject,
        companyName,
        text,
        template,
        to,
        context,
        attachments,
        from,
    }: {
        subject: string;
        companyName: string;
        template?: string;
        text?: string;
        to?: string;
        context?: {
            [name: string]: any;
        };
        attachments?: Attachment[];
        from?: string;
    }) {
        this.logger.log(`Sending notification about ${subject} from ${companyName} to ${to}`);
        if (process.env.NODE_ENV === 'production') {
            subject = `Cracy PDE - ${subject}`;
        } else {
            subject = `Cracy PDE - ${process.env.ENVIRONMENT} - ${subject}`;
        }
        await this.mailerService
            .sendMail({
                to: to ? to : this.toAddress,
                from: from ? from : mailFrom,
                subject: subject,
                template: template ? template : './generic',
                context: text || !context ? { body: text } : context,
                attachments,
            })
            .catch(error => {
                this.logger.error(`Error occurred while sending notification: ${error}`);
            });
    }
}
