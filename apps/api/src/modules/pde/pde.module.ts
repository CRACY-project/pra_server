import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '@/modules/auth/auth.module';
import { PDEController } from '@/modules/pde/pde.controller';
import { PDEService } from '@/modules/pde/pde.service';
import { PrismaModule } from '@/modules/prisma/prisma.module';

import { PDEUpdateController } from './pde-update.controller';

@Module({
    imports: [forwardRef(() => AuthModule), PrismaModule],
    providers: [PDEService],
    controllers: [PDEController, PDEUpdateController],
    exports: [],
})
export class PDEModule {}
