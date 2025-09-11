import { SubstrateModule } from 'src/core/substrate/substrate.module';

import { Module } from '@nestjs/common';

import { SetTimelockedWeightsController } from './set-timelocked-weights.controller';
import { SetTimelockedWeightsService } from './set-timelocked-weights.service';

@Module({
  imports: [SubstrateModule],
  controllers: [SetTimelockedWeightsController],
  providers: [SetTimelockedWeightsService],
})
export class SetTimelockedWeightsModule {}
