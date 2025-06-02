import { Injectable, Logger } from '@nestjs/common';

import { CompanySeederService } from './company/company.seeder.service';
import { UserSeederService } from './user/user.seeder.service';

@Injectable()
export class Seeder {
    constructor(
        private readonly logger: Logger,
        private readonly companySeederService: CompanySeederService,
        private readonly userSeederService: UserSeederService
    ) {}

    async seed() {
        this.logger.debug('Seeding started...');
        await this.companySeederService.seed();
        await this.userSeederService.seed();
    }
}

export abstract class ISeeder {
    abstract seed(): Promise<void>;
}
