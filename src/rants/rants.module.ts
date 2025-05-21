import { Module } from '@nestjs/common';
import { RantsService } from './rants.service';
import { RantsController } from './rants.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RantsController],
  providers: [RantsService],
  exports: [RantsService],
})
export class RantsModule {}
