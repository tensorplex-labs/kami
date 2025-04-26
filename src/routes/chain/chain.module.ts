import { Module } from '@nestjs/common';
import { ChainController } from './chain.controller';
import { ChainService } from './chain.service';
import { SubnetMetagraphMapper } from '../mappers/subnet-metagraph.mapper';
import { Logger } from '@nestjs/common';

@Module({
  controllers: [ChainController],
  providers: [ChainService, SubnetMetagraphMapper, Logger],
  exports: [ChainService], // export incase other modules need
})
export class ChainModule {}
