import { SubstrateModule } from 'src/core/substrate/substrate.module';

import { Module } from '@nestjs/common';

import { LatestBlockController } from './latest-block.controller';
import { LatestBlockMapper } from './latest-block.mapper';
import { LatestBlockService } from './latest-block.service';

@Module({
  imports: [SubstrateModule],
  controllers: [LatestBlockController],
  providers: [LatestBlockService, LatestBlockMapper],
})
export class LatestBlockModule {}
