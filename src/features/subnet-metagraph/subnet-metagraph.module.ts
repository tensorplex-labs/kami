import { SubstrateModule } from 'src/core/substrate/substrate.module';

import { Module } from '@nestjs/common';

import { SubnetMetagraphController } from './subnet-metagraph.controller';
import { SubnetMetagraphMapper } from './subnet-metagraph.mapper';
import { SubnetMetagraphService } from './subnet-metagraph.service';

@Module({
  imports: [SubstrateModule],
  controllers: [SubnetMetagraphController],
  providers: [SubnetMetagraphService, SubnetMetagraphMapper],
})
export class SubnetMetagraphModule {}
