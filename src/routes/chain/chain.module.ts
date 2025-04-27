import { Logger, Module } from '@nestjs/common';

import { SubnetMetagraphMapper } from '../mappers/subnet-metagraph.mapper';
import { ChainController } from './chain.controller';
import { ChainService } from './chain.service';

@Module({
  controllers: [ChainController],
  providers: [ChainService, SubnetMetagraphMapper, Logger],
  exports: [ChainService], // export incase other modules need
})
export class ChainModule {}
