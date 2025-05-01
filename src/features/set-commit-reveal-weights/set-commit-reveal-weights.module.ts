import { SubstrateModule } from 'src/core/substrate/substrate.module';

import { Module } from '@nestjs/common';

import { SetCommitRevealWeightsController } from './set-commit-reveal-weights.controller';
import { SetCommitRevealWeightsService } from './set-commit-reveal-weights.service';

@Module({
  imports: [SubstrateModule],
  controllers: [SetCommitRevealWeightsController],
  providers: [SetCommitRevealWeightsService],
})
export class SetCommitRevealWeightsModule {}
