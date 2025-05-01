import { SubstrateModule } from 'src/core/substrate/substrate.module';

import { Module } from '@nestjs/common';

import { SetWeightsController } from './set-weights.controller';
import { SetWeightsService } from './set-weights.service';

@Module({
  imports: [SubstrateModule],
  controllers: [SetWeightsController],
  providers: [SetWeightsService],
})
export class SetWeightsModule {}
