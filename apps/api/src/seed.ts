import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { Seeder } from './database/seeders/seeder';
import { SeederModule } from './database/seeders/seeder.module';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(SeederModule);

    const logger = app.get(Logger);
    const seeder = app.get(Seeder);
    await seeder.seed();
    logger.debug('Seeding complete!');
}
bootstrap().catch(error => {
    console.error(error);
});
