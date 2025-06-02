import { PrismaClient } from '@cracy/database';
import { Injectable, OnModuleInit, Optional } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor(@Optional() url?: string) {
        super({
            datasources: {
                db: { url: url ? url : process.env.DATABASE_URL },
            },
        });
    }
    async onModuleInit() {
        await this.$connect();
    }
}
